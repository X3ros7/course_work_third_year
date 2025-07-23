import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import * as crypto from 'node:crypto';

import { compareSync, hash } from 'bcrypt';
import { Queue } from 'bullmq';
import { Repository, DeepPartial, LessThanOrEqual } from 'typeorm';

import { JwtAuthService } from '@app/auth';
import { AuthConfigService } from '@app/config';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  ResendEmailDto,
  VerifyEmailDto,
} from '@app/dto';
import { User, HashRegister } from '@app/entities';
import { Roles } from '@app/enums';
import {
  IAuthResult,
  SendCodeMailQueueParams,
  Tokens,
  UserAuthResult,
} from '@app/interfaces';

import { UserService } from 'src/user/user.service';
import { RedisRepository } from '@app/redis';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtAuthService,
    private readonly configService: AuthConfigService,
    @InjectQueue('mail') private readonly queue: Queue,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(HashRegister)
    private readonly registerRepository: Repository<HashRegister>,
    @Inject(RedisRepository)
    private readonly redisRepository: RedisRepository,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  async login(dto: LoginDto): Promise<IAuthResult> {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.error('User not found', { email, context: 'login' });
      throw new UnauthorizedException('User not found');
    }

    if (!compareSync(password, user.password)) {
      throw new ForbiddenException('Incorrect password');
    }

    const tokens = await this.generateTokens(user);
    return this.getAuthResult(user, tokens);
  }

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords doesn`t match');
    }
    const { firstName, lastName, email, password } = dto;

    const checkUserEmail = await this.userService.findByEmail(email);
    if (checkUserEmail) {
      throw new BadRequestException('User with this email alread exists.');
    }

    const hashedPassword = await hash(password, 10);

    const data = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: Roles.User,
    };

    const newUser = this.userRepository.merge(new User(), data);
    await this.redisRepository.setEx(
      `user_${newUser.email}`,
      JSON.stringify(newUser),
      5 * 60, // 5 minutes
    );
    console.log(newUser);

    // TODO move this to separate util service or function
    const code = crypto.randomInt(100000, 1000000);

    await this.registerRepository.save({
      hash: newUser.email,
      code,
    });

    const params: SendCodeMailQueueParams = {
      firstName: firstName,
      email,
      code,
    };
    await this.queue.add('send_code', params, {
      removeOnComplete: true,
      removeOnFail: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...returnData } = data;
    return returnData;
  }

  // TODO add verify with SMS method
  // I'm not sure i need it though
  // Twilio's already configured...

  async verifyEmail(dto: VerifyEmailDto): Promise<IAuthResult> {
    const { email, code } = dto;

    const userData = await this.redisRepository.get(`user_${email}`);
    if (!userData) {
      throw new UnauthorizedException('User with this email not found');
    }

    const user = JSON.parse(userData) as User;
    await this.redisRepository.del(`user_${email}`);

    const userRegister = await this.registerRepository.findOneBy({
      hash: user.email,
    });
    if (!userRegister) {
      throw new BadRequestException('User registration not found');
    }

    if (code !== userRegister.code) {
      throw new BadRequestException('Invalid code');
    }

    const newUser = this.userRepository.merge(user, { isVerified: true });
    await this.userRepository.save(newUser);

    await this.registerRepository.remove(userRegister);

    const tokens = await this.generateTokens(user);
    return this.getAuthResult(user, tokens);
  }

  async resendEmail(dto: ResendEmailDto) {
    const { email } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User with this email not found');
    }

    await this.registerRepository.delete({
      hash: user.email,
    });

    const code = crypto.randomInt(100000, 1000000);

    await this.registerRepository.save({
      hash: user.email,
      code,
    });

    const params: SendCodeMailQueueParams = {
      firstName: user.firstName,
      email,
      code,
    };

    await this.queue.add('send_code', params, {
      removeOnComplete: true,
      removeOnFail: true,
    });

    return {
      message: 'Code for email verification sent. Please check your email.',
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User with this email not found');
    }

    // TODO move this to separate util service or function
    const code = crypto.randomInt(100000, 1000000);

    await this.registerRepository.save({
      user,
      code,
    });

    const params: SendCodeMailQueueParams = {
      firstName: user.firstName,
      email,
      code,
    };

    await this.queue.add('send_code', params, {
      removeOnComplete: true,
      removeOnFail: true,
    });

    return {
      message:
        'Code for reset password sent. Please check your email for the code.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, password, confirmPassword, code } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords doesn`t match');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User with this email not found');
    }

    const userRegister = await this.registerRepository.findOneBy({
      hash: user.email,
    });

    if (!userRegister) {
      throw new BadRequestException('User registration not found');
    }

    if (code !== userRegister.code) {
      throw new BadRequestException('Invalid code');
    }

    const updateQuery: DeepPartial<User> = {
      password: await hash(password, 10),
    };

    const updatedUser = await this.userRepository.update(user.id, updateQuery);
    if (!updatedUser) {
      throw new InternalServerErrorException('Failed to reset password');
    }

    await this.registerRepository.remove(userRegister);

    return {
      message: 'Password reset successfully',
    };
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken) as {
      sub: string;
      refresh?: boolean;
    };
    if (!decoded || decoded.refresh !== true) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(Number(decoded.sub));
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(user);
    return this.getAuthResult(user, tokens);
  }

  @OnEvent('auth.delete_codes', { async: true })
  async deleteCodes() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await this.registerRepository.delete({
      createdAt: LessThanOrEqual(fiveMinutesAgo),
    });
  }

  private getAuthResult(
    user: User,
    tokens: { token: string; refreshToken: string },
  ): IAuthResult {
    const result: UserAuthResult = {
      ...tokens,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    };
    return result;
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const payload = {
      sub: user.id,
      isBlocked: user.isBlocked,
      isAdmin: user.role === Roles.Admin,
    };

    const accessOptions = {
      issuer: this.configService.issuer,
      expiresIn: `${this.configService.accessExpiresInMinutes}m`,
    };
    const token = await this.jwtService.generateToken(payload, accessOptions);

    const refreshOptions = {
      issuer: this.configService.issuer,
      expiresIn: `${this.configService.refreshExpiresInMinutes}m`,
    };

    const refreshToken = await this.jwtService.generateToken(
      { ...payload, refresh: true },
      refreshOptions,
    );

    return {
      token,
      refreshToken,
    };
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { compareSync, hash } from 'bcrypt';
import { Repository } from 'typeorm';

import { JwtAuthService } from '@app/auth';
import { AuthConfigService } from '@app/config';
import { LoginSellerDto, RegisterSellerDto } from '@app/dto';
import { Seller } from '@app/entities';
import { IAuthResult, SellerAuthResult, Tokens } from '@app/interfaces';

import { UserService } from 'src/user/user.service';

@Injectable()
export class SellerAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: AuthConfigService,
    private readonly jwtService: JwtAuthService,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async login(dto: LoginSellerDto): Promise<IAuthResult> {
    const { email, password } = dto;

    const seller = await this.sellerRepository
      .createQueryBuilder('s')
      .select(['s', 's.password'])
      .where('s.email = :email', { email })
      .getOne();
    if (!seller) {
      throw new BadRequestException('Seller not found');
    }

    if (!compareSync(password, seller.password)) {
      throw new BadRequestException('Wrong password');
    }

    const tokens = await this.generateTokens(seller);
    return this.getAuthResult(seller, tokens);
  }

  async register(dto: RegisterSellerDto): Promise<IAuthResult> {
    const { email, name, password, description } = dto;

    const checkSeller = await this.sellerRepository.findOneBy({ email });
    if (checkSeller) {
      throw new BadRequestException('Seller with this email already exists');
    }

    const checkUser = await this.userService.findByEmail(email);
    if (checkUser) {
      throw new BadRequestException(
        'This email is alread used for user account',
      );
    }

    const data = {
      email,
      name,
      password: await hash(password, 10),
      description,
    };
    const newSeller = await this.sellerRepository.save(data);
    if (!newSeller) {
      throw new InternalServerErrorException('Error while adding new seller');
    }

    const tokens = await this.generateTokens(newSeller);
    return this.getAuthResult(newSeller, tokens);
  }

  private getAuthResult(
    seller: Seller,
    tokens: { token: string; refreshToken: string },
  ): IAuthResult {
    const result: SellerAuthResult = {
      ...tokens,
      seller: {
        id: seller.id,
        name: seller.name,
        description: seller.description,
        isBlocked: seller.isBlocked,
      },
    };
    return result;
  }

  private async generateTokens(seller: Seller): Promise<Tokens> {
    const payload = { sub: seller.id, isBlocked: false };

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
      payload,
      refreshOptions,
    );

    return {
      token,
      refreshToken,
    };
  }
}

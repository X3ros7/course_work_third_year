import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfigService } from '@app/config';
import { User } from '@app/entities';

import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authConfig: AuthConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    });
  }

  async validate(payload: { iss: string; sub: string }): Promise<User> {
    if (payload.iss !== this.authConfig.issuer) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(Number(payload.sub));
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}

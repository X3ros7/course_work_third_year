import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfigService } from '@app/config';
import { Seller } from '@app/entities';

import { SellerService } from 'src/seller/seller.service';

@Injectable()
export class JwtSellerAuthStrategy extends PassportStrategy(
  Strategy,
  'jwt-seller',
) {
  constructor(
    private readonly sellerService: SellerService,
    private readonly authConfig: AuthConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    });
  }

  async validate(payload: { iss: string; sub: string }): Promise<Seller> {
    if (payload.iss !== this.authConfig.issuer) {
      throw new UnauthorizedException();
    }

    const seller = await this.sellerService.findById(Number(payload.sub));
    if (!seller) {
      throw new UnauthorizedException('Seller not found');
    }

    return seller;
  }
}

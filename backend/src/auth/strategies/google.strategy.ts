import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { GoogleConfigService } from '@app/config';
import { Profile } from 'passport';

export interface GoogleUser {
  providerId: string;
  provider: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly googleService: GoogleConfigService) {
    super({
      clientID: googleService.clientId,
      clientSecret: googleService.clientSecret,
      callbackURL: googleService.redirectUri,
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
    };

    done(null, user);
  }
}

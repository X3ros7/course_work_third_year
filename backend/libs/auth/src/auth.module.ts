import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthConfigModule, AuthConfigService } from '@app/config';

import { JwtAuthService } from './auth.service';

@Module({
  imports: [
    AuthConfigModule,
    JwtModule.registerAsync({
      imports: [AuthConfigModule],
      useFactory: (config: AuthConfigService) => ({
        secret: config.secret,
        signOptions: { expiresIn: `${config.accessExpiresInMinutes}m` },
      }),
      inject: [AuthConfigService],
    }),
  ],
  providers: [JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}

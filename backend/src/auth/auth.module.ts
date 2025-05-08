import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { JwtAuthModule } from '@app/auth';
import {
  AuthConfigModule,
  AppConfigModule,
  GoogleConfigModule,
} from '@app/config';
import { User, HashRegister } from '@app/entities';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthStrategy } from './strategies/jwt.strategy';
import { JwtSellerAuthStrategy } from './strategies/jwt-seller.strategy';
import { UserModule } from 'src/user/user.module';
import { SellerModule } from 'src/seller/seller.module';
import { RedisModule } from '@app/redis';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    AppConfigModule,
    AuthConfigModule,
    JwtAuthModule,
    GoogleConfigModule,
    UserModule,
    SellerModule,
    BullModule.registerQueue({ name: 'mail' }),
    TypeOrmModule.forFeature([HashRegister, User]),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthStrategy,
    JwtSellerAuthStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}

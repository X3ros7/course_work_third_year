import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthModule } from '@app/auth';
import { AuthConfigModule } from '@app/config';
import { Seller, User } from '@app/entities';

import { SellerAuthService } from './auth.service';
import { SellerAuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AuthConfigModule,
    JwtAuthModule,
    UserModule,
    TypeOrmModule.forFeature([User, Seller]),
  ],
  controllers: [SellerAuthController],
  providers: [SellerAuthService],
})
export class SellerAuthModule {}

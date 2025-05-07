import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Seller } from '@app/entities';

import { AdminSellersService } from './seller.service';
import { AdminSellersController } from './seller.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  controllers: [AdminSellersController],
  providers: [AdminSellersService],
})
export class AdminSellersModule {}

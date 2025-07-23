import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, ProductImage, Seller } from '@app/entities';
import { RedisConfigModule } from '@app/config';

import { SellerProductsService } from './products.service';
import { SellerProductsController } from './products.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'upload' }),
    TypeOrmModule.forFeature([Seller, Product, ProductImage]),
    RedisConfigModule,
  ],
  controllers: [SellerProductsController],
  providers: [SellerProductsService],
})
export class SellerProductsModule {}

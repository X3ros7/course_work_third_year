import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Seller } from '@app/entities';

import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { SellerAuthModule } from './auth/auth.module';
import { SellerProductsModule } from './products/products.module';
import { SellerOrdersModule } from './orders/orders.module';

@Module({
  imports: [
    SellerAuthModule,
    TypeOrmModule.forFeature([Seller]),
    SellerProductsModule,
    SellerOrdersModule,
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}

import { Module } from '@nestjs/common';

import { AdminUsersModule } from './users/user.module';
import { AdminSellersModule } from './sellers/seller.module';
import { AdminProductModule } from './products/products.module';
import { AdminOrdersModule } from './orders/orders.module';

@Module({
  imports: [
    AdminUsersModule,
    AdminSellersModule,
    AdminProductModule,
    AdminOrdersModule,
  ],
})
export class AdminModule {}

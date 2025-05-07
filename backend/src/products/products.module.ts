import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, UserFavorite, Order, Review, User } from '@app/entities';
import { StripeModule } from '@app/stripe';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UserModule } from 'src/user/user.module';
import { BullModule } from '@nestjs/bullmq';
import { ReceiptModule } from 'src/receipt/receipt.module';

@Module({
  imports: [
    UserModule,
    StripeModule,
    ReceiptModule,
    TypeOrmModule.forFeature([Product, UserFavorite, Order, Review, User]),
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

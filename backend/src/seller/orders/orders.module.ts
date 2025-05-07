import { Module } from '@nestjs/common';
import { SellerOrdersService } from './orders.service';
import { SellerOrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@app/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [SellerOrdersController],
  providers: [SellerOrdersService],
})
export class SellerOrdersModule {}

import { Module } from '@nestjs/common';
import { AdminOrdersService } from './orders.service';
import { AdminOrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@app/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [AdminOrdersController],
  providers: [AdminOrdersService],
})
export class AdminOrdersModule {}

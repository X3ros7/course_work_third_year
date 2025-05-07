import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '@app/entities';

import { AdminProductsService } from './products.service';
import { AdminProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [AdminProductsController],
  providers: [AdminProductsService],
})
export class AdminProductModule {}

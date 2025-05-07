import {
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { SellerOrdersService } from './orders.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthSellerGuard } from '@app/guards';
import { Order } from '@app/entities';
import { SellerAuthRequest } from '@app/interfaces';

@ApiBearerAuth()
@Controller('seller/orders')
@UseGuards(JwtAuthSellerGuard)
export class SellerOrdersController {
  constructor(private readonly ordersService: SellerOrdersService) {}

  // TODO pagination
  @Get()
  async index(@Req() { seller }: SellerAuthRequest): Promise<Order[]> {
    return this.ordersService.findAll(seller.id);
  }

  @Get(':id')
  async findOne(
    @Req() { seller }: SellerAuthRequest,
    @Param('id') id: number,
  ): Promise<Order> {
    return this.ordersService.findOne(seller.id, id);
  }

  @Patch(':id')
  async patch(
    @Req() { seller }: SellerAuthRequest,
    @Param('id') id: number,
    @Body() body: { deliveryStatus: string },
  ): Promise<Order> {
    return this.ordersService.patch(seller.id, id, body);
  }
}

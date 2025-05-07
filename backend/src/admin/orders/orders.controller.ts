import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminOrdersService } from './orders.service';
import { Order } from '@app/entities';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '@app/guards';
import { RolesGuard } from '@app/guards';
import { Roles } from '@app/enums';
import { AllowRoles } from '@app/decorators';

@ApiBearerAuth()
@Controller('/admin/orders')
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@AllowRoles(Roles.Admin)
export class AdminOrdersController {
  constructor(private readonly ordersService: AdminOrdersService) {}

  // TODO pagination
  @Get()
  async index(@Query('sellerId') sellerId: number): Promise<Order[]> {
    return this.ordersService.findAll(sellerId);
  }
}

import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
  ApiPaginationQuery,
  FilterOperator,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { UpdateSellerDto } from '@app/dto';
import { Seller } from '@app/entities';
import { JwtAdminAuthGuard, RolesGuard } from '@app/guards';
import { AllowRoles } from '@app/decorators';
import { Roles } from '@app/enums';

import { AdminSellersService } from './seller.service';

@ApiBearerAuth()
@Controller('admin/sellers')
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@AllowRoles(Roles.Admin)
export class AdminSellersController {
  constructor(private readonly sellerService: AdminSellersService) {}

  // TODO move this to separate config file
  @ApiPaginationQuery({
    sortableColumns: ['id', 'name', 'email', 'createdAt'],
    select: [
      'id',
      'name',
      'email',
      'avatar',
      'description',
      'isVerified',
      'isBlocked',
      'createdAt',
    ],
    filterableColumns: {
      name: [FilterOperator.EQ, FilterOperator.ILIKE],
      email: [FilterOperator.EQ, FilterOperator.ILIKE],
      description: [FilterOperator.EQ, FilterOperator.ILIKE],
      isVerified: [FilterOperator.EQ],
      isBlocked: [FilterOperator.EQ],
      createdAt: [
        FilterOperator.EQ,
        FilterOperator.BTW,
        FilterOperator.GTE,
        FilterOperator.LTE,
      ],
    },
  })
  @Get()
  async index(@Paginate() query: PaginateQuery): Promise<Paginated<Seller>> {
    return this.sellerService.index(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.sellerService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateSellerDto) {
    return this.sellerService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.sellerService.delete(id);
  }
}

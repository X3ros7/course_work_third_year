import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
  ApiPaginationQuery,
  FilterOperator,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { UpdateProductDto } from '@app/dto';
import { Product } from '@app/entities';
import { JwtAdminAuthGuard, RolesGuard } from '@app/guards';
import { AllowRoles } from '@app/decorators';
import { Roles } from '@app/enums';

import { AdminProductsService } from './products.service';

@ApiBearerAuth()
@Controller('admin/products')
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@AllowRoles(Roles.Admin)
export class AdminProductsController {
  constructor(private readonly productsService: AdminProductsService) {}

  @ApiPaginationQuery({
    relations: ['images'],
    sortableColumns: [
      'id',
      'name',
      'artist',
      'description',
      'year',
      'createdAt',
      'images.url',
    ],
    select: [
      'id',
      'name',
      'artist',
      'description',
      'year',
      'isActive',
      'isDeleted',
      'createdAt',
      'images.url',
    ],
    filterableColumns: {
      name: [FilterOperator.EQ, FilterOperator.ILIKE],
      artist: [FilterOperator.EQ, FilterOperator.ILIKE],
      year: [
        FilterOperator.EQ,
        FilterOperator.BTW,
        FilterOperator.GTE,
        FilterOperator.LTE,
        FilterOperator.IN,
      ],
      isActive: [FilterOperator.EQ],
      isDeleted: [FilterOperator.EQ],
    },
  })
  @Get()
  async index(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    return this.productsService.index(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productsService.delete(id);
  }
}

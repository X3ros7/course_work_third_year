import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
  ApiPaginationQuery,
  FilterOperator,
  Paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { Product } from '@app/entities';
import { JwtAuthGuard, RolesGuard } from '@app/guards';
import { AuthRequest } from '@app/interfaces';

import { ProductsService } from './products.service';
import { AllowRoles } from '@app/decorators';
import { Roles } from '@app/enums';
import { ReviewDto } from '@app/dto';

// TODO refactor this (?)
const paginateConfig: PaginateConfig<Product> = {
  sortableColumns: [
    'name',
    'createdAt',
    'year',
    'price',
    'seller.name',
    'genre',
  ],
  filterableColumns: {
    name: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    createdAt: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
    year: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
    price: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
    genre: [FilterOperator.EQ, FilterOperator.IN],
    'seller.name': [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
  },
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiPaginationQuery(paginateConfig)
  @Get()
  async index(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    return this.productsService.index(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.productsService.getOne(id);
  }

  @ApiBearerAuth()
  @Post(':id/buy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowRoles(Roles.User)
  async buy(@Req() { user }: AuthRequest, @Param('id') id: number) {
    return this.productsService.buy(user, id);
  }

  @ApiBearerAuth()
  @Post(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowRoles(Roles.User)
  async review(
    @Req() { user }: AuthRequest,
    @Param('id') id: number,
    @Body() body: ReviewDto,
  ) {
    return this.productsService.review(user, id, body);
  }

  @ApiBearerAuth()
  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowRoles(Roles.User)
  async favorite(@Req() { user }: AuthRequest, @Param('id') id: number) {
    return this.productsService.favorite(user, id);
  }
}

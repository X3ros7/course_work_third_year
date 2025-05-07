import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  ApiPaginationQuery,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { PaginationConfig } from '@app/config';
import { CreateProductDto, UpdateProductDto } from '@app/dto';
import { Product } from '@app/entities';
import { JwtAuthSellerGuard } from '@app/guards';
import { SellerAuthRequest } from '@app/interfaces';

import { SellerProductsService } from './products.service';

@ApiBearerAuth()
@Controller('seller/products')
@UseGuards(JwtAuthSellerGuard)
export class SellerProductsController {
  constructor(private readonly productsService: SellerProductsService) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Req() { seller }: SellerAuthRequest,
    @Body() dto: CreateProductDto,
    @UploadedFiles() images?: Array<Express.Multer.File>,
  ): Promise<Product> {
    return this.productsService.create(seller, dto, images);
  }

  // TODO change this to separate file or something
  @ApiPaginationQuery(PaginationConfig)
  @Get()
  async index(
    @Req() { seller }: SellerAuthRequest,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Product>> {
    return this.productsService.index(seller, query);
  }

  @Get(':id')
  async findOne(
    @Req() { seller }: SellerAuthRequest,
    @Param('id') id: number,
  ): Promise<Product> {
    return this.productsService.findOne(seller, id);
  }

  @Put(':id')
  async update(
    @Req() { seller }: SellerAuthRequest,
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(seller, id, dto);
  }

  @Patch(':id')
  async patch(
    @Req() { seller }: SellerAuthRequest,
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.patch(seller, id, dto);
  }

  @Delete(':id')
  async remove(@Req() { seller }: SellerAuthRequest, @Param('id') id: number) {
    return this.productsService.remove(seller, id);
  }
}

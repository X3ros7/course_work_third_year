import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { UpdateProductDto } from '@app/dto';
import { Product } from '@app/entities';

@Injectable()
export class AdminProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async index(query: PaginateQuery): Promise<Paginated<Product>> {
    return paginate(query, this.productRepository, {
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
        'createdAt',
        'sellerId',
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
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOneByOrFail({ id });
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepository.findOneByOrFail({ id });
    await this.productRepository.update(product.id, dto);
    return product;
  }

  async delete(id: number) {
    const product = await this.productRepository.findOneByOrFail({ id });
    await this.productRepository.delete(product.id);
    return product;
  }
}

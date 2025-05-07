import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { UpdateSellerDto } from '@app/dto';
import { Seller } from '@app/entities';

@Injectable()
export class AdminSellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async index(query: PaginateQuery): Promise<Paginated<Seller>> {
    return paginate(
      query,
      this.sellerRepository,
      // TODO move config to separate file or something
      {
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
      },
    );
  }

  async findOne(id: number): Promise<Seller> {
    return this.sellerRepository.findOneByOrFail({ id });
  }

  async update(id: number, dto: UpdateSellerDto) {
    const seller = await this.sellerRepository.findOneByOrFail({ id });
    await this.sellerRepository.update(seller.id, dto);
    return seller;
  }

  async delete(id: number) {
    const seller = await this.sellerRepository.findOneByOrFail({ id });
    await this.sellerRepository.delete(seller.id);
    return seller;
  }
}

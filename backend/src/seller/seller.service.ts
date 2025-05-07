import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Seller } from '@app/entities';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async findById(id: number): Promise<Seller> {
    return this.sellerRepository.findOneByOrFail({ id });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@app/entities';

@Injectable()
export class AdminOrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(sellerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        product: {
          seller: { id: sellerId },
        },
      },
    });
  }
}

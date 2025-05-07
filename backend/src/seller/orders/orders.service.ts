import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@app/entities';
import { DeliveryStatus } from '@app/enums';

@Injectable()
export class SellerOrdersService {
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
      relations: ['product', 'user'],
    });
  }

  async findOne(sellerId: number, id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, product: { seller: { id: sellerId } } },
      relations: ['product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async patch(sellerId: number, id: number, body: { deliveryStatus: string }) {
    const newDeliveryStatus = body.deliveryStatus as DeliveryStatus;

    const order = await this.findOne(sellerId, id);
    order.deliveryStatus = newDeliveryStatus;

    return this.orderRepository.save(order);
  }
}

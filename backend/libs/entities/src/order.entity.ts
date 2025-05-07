import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { DeliveryStatus } from '@app/enums';

import { Model } from './base/base.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('orders')
export class Order extends Model {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'stripe_payment_intent_id', select: false })
  stripePaymentIntentId: string;

  @Column({ name: 'stripe_payment_status' })
  stripePaymentStatus: string;

  @Column({ name: 'delivery_status' })
  deliveryStatus: DeliveryStatus;

  @ManyToOne(() => User, (user) => user.orders, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Product, (product) => product.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

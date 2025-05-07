import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Model } from './base/base.entity';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('reviews')
export class Review extends Model {
  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => User, (user) => user.reviews, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

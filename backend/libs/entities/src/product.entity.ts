import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Track } from '@app/interfaces';

import { Model } from './base/base.entity';
import { Seller } from './seller.entity';
import { ProductImage } from './product-image.entity';
import { UserFavorite } from './user-favorite.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';

@Entity('products')
@Check('year > 1900')
export class Product extends Model {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  genre: string;

  @Column()
  artist: string;

  @Column()
  year: number;

  @Column({ type: 'jsonb', name: 'track_list' })
  trackList: Track[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'seller_id' })
  sellerId: number;

  @ManyToOne(() => Seller, (seller) => seller.products)
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;

  @OneToMany(() => ProductImage, (pi) => pi.product)
  images: ProductImage[];

  @OneToMany(() => UserFavorite, (favorite) => favorite.product)
  favoriteTo: UserFavorite[];

  @OneToOne(() => Order, (order) => order.product)
  order: Order;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}

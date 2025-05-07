import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Model } from './base/base.entity';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage extends Model {
  @Column()
  url: string;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

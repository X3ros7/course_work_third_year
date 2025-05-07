import { env } from 'node:process';

import { Column, Entity, OneToMany } from 'typeorm';

import { Model } from './base/base.entity';
import { Product } from './product.entity';

@Entity('sellers')
export class Seller extends Model {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: env.DEFAULT_AVATAR_PATH })
  avatar: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @OneToMany(() => Product, (product) => product.seller, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  products: Product[];
}

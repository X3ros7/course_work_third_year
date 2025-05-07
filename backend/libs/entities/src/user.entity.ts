import { env } from 'node:process';

import { Column, Entity, OneToMany } from 'typeorm';

import { Roles } from '@app/enums';

import { UserFavorite } from './user-favorite.entity';
import { Model } from './base/base.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';

@Entity('users')
export class User extends Model {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: env.DEFAULT_AVATAR_PATH })
  avatar: string;

  @Column()
  role: Roles;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @OneToMany(() => UserFavorite, (favorite) => favorite.user)
  favoriteProducts: UserFavorite[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}

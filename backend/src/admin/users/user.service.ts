import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { UpdateUserDto } from '@app/dto';
import { User } from '@app/entities';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async index(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'firstName', 'lastName', 'createdAt', 'email'],
      select: [
        'id',
        'firstName',
        'lastName',
        'avatar',
        'email',
        'role',
        'isVerified',
        'isBlocked',
        'createdAt',
      ],
      filterableColumns: {
        firstName: true,
        lastName: true,
        email: true,
        role: [FilterOperator.EQ],
        isVerified: [FilterOperator.EQ],
        isBlocked: [FilterOperator.EQ],
        createdAt: true,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneByOrFail({ id });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.update(user.id, dto);
    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.delete(user.id);
    return user;
  }
}

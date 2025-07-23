import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { compare, hash } from 'bcrypt';
import { Job, Queue, QueueEvents } from 'bullmq';
import { isEmpty } from 'class-validator';
import { DeepPartial, LessThanOrEqual, Repository } from 'typeorm';

import { ChangePasswordDto, UpdateUserDto } from '@app/dto';
import { User, UserFavorite, Order } from '@app/entities';
import { SendMailQueueParams } from '@app/interfaces';
import { RedisConfigService } from '@app/config';

@Injectable()
export class UserService {
  private queueEvents: QueueEvents;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserFavorite)
    private readonly userFavoriteRepository: Repository<UserFavorite>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectQueue('upload') private readonly uploadQueue: Queue,
    @InjectQueue('mail') private readonly mailQueue: Queue,
    private readonly redisConfig: RedisConfigService,
  ) {
    this.queueEvents = new QueueEvents('upload', {
      connection: {
        host: this.redisConfig.host,
        port: this.redisConfig.port,
        username: this.redisConfig.user,
        password: this.redisConfig.password,
      },
    });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneByOrFail({ id });
  }

  async favorites(user: User): Promise<UserFavorite[]> {
    const result = await this.userFavoriteRepository
      .createQueryBuilder('uf')
      .leftJoinAndSelect('uf.product', 'p')
      .where('uf.userId = :id', { id: user.id })
      .getMany();
    return result;
  }

  async orders(user: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: ['product', 'product.images'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('u')
      .select(['u', 'u.password'])
      .where('u.email = :email', { email })
      .getOne();
  }

  async changePassword(user: User, dto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword, confirmNewPassword } = dto;
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New password does not match');
    }

    const currentUser = await this.userRepository
      .createQueryBuilder('u')
      .select(['u', 'u.password'])
      .where('u.id = :id', { id: user.id })
      .getOne();

    if (!currentUser) {
      throw new BadRequestException();
    }

    if (!(await compare(oldPassword, currentUser.password))) {
      throw new BadRequestException(
        'Incorrent old password. If you forgot it, proceed with Restore password',
      );
    }

    const updateQuery: DeepPartial<User> = {};
    updateQuery.password = await hash(newPassword, 10);
    await this.userRepository.update({ id: user.id }, updateQuery);

    const params: SendMailQueueParams = {
      firstName: user.firstName,
      email: user.email,
    };
    await this.mailQueue.add('change_password', params, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  async update(
    user: User,
    dto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    const id = user.id;
    let job: Job | null = null;

    const updateQuery: DeepPartial<User> = {};
    if (dto.firstName && dto.firstName !== user.firstName) {
      updateQuery.firstName = dto.firstName;
    }

    if (dto.lastName && dto.lastName !== user.lastName) {
      updateQuery.lastName = dto.lastName;
    }

    if (avatar) {
      job = await this.uploadQueue.add(
        'avatar',
        { file: avatar, id },
        {
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }

    const fields = ['firstName', 'lastName', 'avatar'] as const;
    const result = fields.reduce(
      (acc, key) => {
        if (key in user) {
          acc[key] = user[key];
        }
        return acc;
      },
      {} as Pick<User, (typeof fields)[number]>,
    );

    if (!isEmpty(updateQuery)) {
      if (job) {
        const avatarUrl = (await job.waitUntilFinished(
          this.queueEvents,
        )) as string;
        updateQuery.avatar = avatarUrl.split('?')[0];
      }
      const mergedResult = { ...result, ...updateQuery };

      await this.userRepository
        .createQueryBuilder()
        .update()
        .where({ id })
        .set(mergedResult)
        .execute();
      return mergedResult as User;
    }
    throw new BadRequestException('No changes to update');
  }

  @OnEvent('users.delete_unverified', { async: true })
  async deleteUnverifiedUsers(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.userRepository.delete({
      isVerified: false,
      createdAt: LessThanOrEqual(sevenDaysAgo),
    });
  }
}

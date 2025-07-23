import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, UserFavorite, Order } from '@app/entities';
import { RedisConfigModule } from '@app/config';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserFavorite, Order]),
    BullModule.registerQueue({ name: 'upload' }, { name: 'mail' }),
    UploadModule,
    RedisConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AppConfigModule,
  DbConfigModule,
  DbConfigService,
  RedisConfigModule,
  RedisConfigService,
} from '@app/config';
import * as entities from '@app/entities';

import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { UploadModule } from 'src/upload/upload.module';
import { SellerModule } from 'src/seller/seller.module';

import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { ProductsModule } from 'src/products/products.module';
import { WebhookModule } from 'src/webhook/webhook.module';
import { AdminModule } from 'src/admin/admin.module';
import { HealthModule } from 'src/health/health.module';

@Module({
  imports: [
    /* Configs */
    AppConfigModule,

    /* Nest.js modules*/
    TypeOrmModule.forRootAsync({
      imports: [DbConfigModule],
      useFactory: (config: DbConfigService) => ({
        type: config.type,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: Object.values(entities),
        synchronize: false,
      }),
      inject: [DbConfigService],
    }),
    BullModule.forRootAsync({
      imports: [RedisConfigModule],
      useFactory: (config: RedisConfigService) => ({
        connection: {
          host: config.host,
          port: config.port,
          username: config.user,
          password: config.password,
        },
      }),
      inject: [RedisConfigService],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),

    /* App modules */
    AdminModule,
    AuthModule,
    HealthModule,
    MailerModule,
    ProductsModule,
    SchedulerModule,
    SellerModule,
    UploadModule,
    UserModule,
    WebhookModule,
  ],
})
export class AppModule {}

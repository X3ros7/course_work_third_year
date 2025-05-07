import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RedisConfigService as RedisConfigService } from './redis.service';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisConfigModule {}

import { Module } from '@nestjs/common';

import { RedisConfigModule } from '@app/config';

import { RedisRepository } from './redis.repository';
import { redisClientFactor } from './redis.factory';

@Module({
  imports: [RedisConfigModule],
  providers: [RedisRepository, redisClientFactor],
  exports: [RedisRepository],
})
export class RedisModule {}

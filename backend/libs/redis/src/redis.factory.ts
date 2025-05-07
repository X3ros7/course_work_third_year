import { FactoryProvider } from '@nestjs/common';

import { Redis } from 'ioredis';

import { RedisConfigService } from '@app/config';

export const redisClientFactor: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (config: RedisConfigService) => {
    const redis = new Redis({
      host: config.host,
      port: config.port,
    });
    redis.on('error', (error) => {
      throw new Error('Redis connection error:', error);
    });
    return redis;
  },
  inject: [RedisConfigService],
};

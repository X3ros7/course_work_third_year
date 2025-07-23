import { FactoryProvider } from '@nestjs/common';

import { Redis } from 'ioredis';

import { RedisConfigService } from '@app/config';

export const redisClientFactor: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (config: RedisConfigService) => {
    console.log('Redis Config Debug:', {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password ? '[SET]' : '[NOT SET]',
    });

    const redis = new Redis({
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
    });
    redis.on('error', (error) => {
      console.error('Redis connection error:', error);
      throw new Error(`Redis connection error: ${error.message}`);
    });
    return redis;
  },
  inject: [RedisConfigService],
};

import { Inject, Injectable } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
  constructor(@Inject('RedisClient') private readonly redis: Redis) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async setEx(key: string, value: string, seconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', seconds);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.redis.expire(key, seconds);
  }
}

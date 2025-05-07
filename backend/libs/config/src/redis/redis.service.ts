import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private readonly config: ConfigService) {}

  public get host(): string {
    return this.config.getOrThrow<string>('redis.host');
  }

  public get port(): number {
    return this.config.getOrThrow<number>('redis.port');
  }

  public get user(): string {
    return this.config.getOrThrow<string>('redis.user');
  }

  public get password(): string {
    return this.config.getOrThrow<string>('redis.port');
  }
}

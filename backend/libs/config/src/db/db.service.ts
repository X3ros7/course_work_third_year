import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type DbType = 'mysql' | 'postgres' | 'sqlite';

@Injectable()
export class DbConfigService {
  constructor(private readonly config: ConfigService) {}

  public get type(): DbType {
    return 'postgres';
  }

  public get host(): string {
    return this.config.getOrThrow<string>('db.host');
  }

  public get port(): number {
    return this.config.getOrThrow<number>('db.port');
  }

  public get username(): string {
    return this.config.getOrThrow<string>('db.username');
  }

  public get password(): string {
    return this.config.getOrThrow<string>('db.password');
  }

  public get database(): string {
    return this.config.getOrThrow<string>('db.database');
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageConfigService {
  constructor(private config: ConfigService) {}

  public get endPoint(): string {
    return this.config.getOrThrow<string>('storage.endPoint');
  }

  public get port(): number {
    return this.config.getOrThrow<number>('storage.port');
  }

  public get accessKey(): string {
    return this.config.getOrThrow<string>('storage.accessKey');
  }

  public get secretKey(): string {
    return this.config.getOrThrow<string>('storage.secretKey');
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  public get env(): string {
    return this.config.getOrThrow<string>('app.env');
  }

  public get host(): string {
    return this.config.getOrThrow<string>('app.host');
  }

  public get port(): string {
    return this.config.getOrThrow<string>('app.port');
  }
}

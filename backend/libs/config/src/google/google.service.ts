import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get clientId(): string {
    return this.configService.getOrThrow('google.clientId');
  }

  public get clientSecret(): string {
    return this.configService.getOrThrow('google.clientSecret');
  }

  public get redirectUri(): string {
    return this.configService.getOrThrow('google.redirectUri');
  }
}

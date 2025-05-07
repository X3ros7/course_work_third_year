import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private config: ConfigService) {}

  public get secret(): string {
    return this.config.getOrThrow<string>('auth.secret');
  }

  public get issuer(): string {
    return this.config.getOrThrow<string>('auth.iss');
  }

  public get accessExpiresInMinutes(): number {
    return this.config.getOrThrow<number>('auth.accessExpiresInMinutes');
  }

  public get refreshExpiresInMinutes(): number {
    return this.config.getOrThrow<number>('auth.refreshExpiresInMinutes');
  }
}

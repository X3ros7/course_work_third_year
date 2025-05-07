import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailgunConfigService {
  constructor(private readonly config: ConfigService) {}

  public get apiKey(): string {
    return this.config.getOrThrow<string>('mail.apiKey');
  }

  public get apiUrl(): string {
    return this.config.getOrThrow<string>('mail.apiUrl');
  }

  public get domain(): string {
    return this.config.getOrThrow<string>('mail.domain');
  }

  public get from(): string {
    return this.config.getOrThrow<string>('mail.from');
  }
}

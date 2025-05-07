import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioConfigService {
  constructor(private config: ConfigService) {}

  public get accountSid(): string {
    return this.config.getOrThrow<string>('twilio.accountSid');
  }

  public get authToken(): string {
    return this.config.getOrThrow<string>('twilio.authToken');
  }

  public get apiUrl(): string {
    return `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
  }

  public get from(): string {
    return this.config.getOrThrow<string>('twilio.from');
  }
}

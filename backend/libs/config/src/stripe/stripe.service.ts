import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeConfigService {
  constructor(private readonly config: ConfigService) {}

  public get secret(): string {
    return this.config.getOrThrow<string>('stripe.secret');
  }

  public get publish(): string {
    return this.config.getOrThrow<string>('stripe.publish');
  }

  public get redirectUrl(): string {
    return this.config.getOrThrow<string>('stripe.redirectUrl');
  }
}

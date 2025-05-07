import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookConfigService {
  constructor(private readonly config: ConfigService) {}

  public get stripe(): string {
    return this.config.getOrThrow<string>('webhook.stripe');
  }
}

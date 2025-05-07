import { Module } from '@nestjs/common';

import { WebhookConfigModule } from '@app/config';
import { StripeModule } from '@app/stripe';

import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [WebhookConfigModule, StripeModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}

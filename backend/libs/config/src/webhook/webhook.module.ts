import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WebhookConfigService } from './webhook.service';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [WebhookConfigService],
  exports: [WebhookConfigService],
})
export class WebhookConfigModule {}

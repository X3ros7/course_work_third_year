import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StripeConfigService } from './stripe.service';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [StripeConfigService],
  exports: [StripeConfigService],
})
export class StripeConfigModule {}

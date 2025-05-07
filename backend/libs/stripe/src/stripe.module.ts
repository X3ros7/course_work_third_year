import { Module } from '@nestjs/common';

import { StripeConfigModule } from '@app/config';

import { StripeService } from './stripe.service';

@Module({
  imports: [StripeConfigModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { TwilioConfigModule } from '@app/config';

import { TwilioService } from './twilio.service';

@Module({
  imports: [HttpModule, TwilioConfigModule],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}

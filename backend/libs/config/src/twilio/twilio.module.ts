import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TwilioConfigService } from './twilio.service';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [TwilioConfigService],
  exports: [TwilioConfigService],
})
export class TwilioConfigModule {}

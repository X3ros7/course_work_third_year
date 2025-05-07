import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config';
import { MailgunConfigService } from './mailgun.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [MailgunConfigService],
  exports: [MailgunConfigService],
})
export class MailgunConfigModule {}

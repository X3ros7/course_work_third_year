import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MailgunConfigModule } from '@app/config';

import { MailgunService } from './mailgun.service';

@Module({
  imports: [HttpModule, MailgunConfigModule],
  providers: [MailgunService],
  exports: [MailgunService],
})
export class MailgunModule {}

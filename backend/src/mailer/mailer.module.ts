import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { MailgunModule } from '@app/mailgun';

import { MailerService } from './mailer.service';
import { MailConsumer as MailerConsumer } from './mailer.consumer';

@Module({
  imports: [
    MailgunModule,
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [MailerService, MailerConsumer],
})
export class MailerModule {}

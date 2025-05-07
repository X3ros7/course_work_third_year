import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';

import {
  SendCodeMailQueueParams,
  SendMailQueueParams,
  SendReceiptSuccessMailQueueParams,
} from '@app/interfaces';

import { MailerService } from './mailer.service';

type MailJobName =
  | 'send_code'
  | 'change_password'
  | 'restore_password'
  | 'send_receipt_success';

@Processor('mail')
export class MailConsumer extends WorkerHost {
  constructor(private readonly mailService: MailerService) {
    super();
  }

  async process(
    job: Job<SendMailQueueParams, void, MailJobName>,
  ): Promise<void> {
    switch (job.name) {
      case 'send_code':
        await this.mailService.sendCode(job.data as SendCodeMailQueueParams);
        break;
      case 'change_password':
        await this.mailService.sendChangePassword(job.data);
        break;
      case 'send_receipt_success':
        await this.mailService.sendReceiptSuccess(
          job.data as SendReceiptSuccessMailQueueParams,
        );
        break;
      default:
        console.log('Wrong job name');
        return;
    }
  }
}

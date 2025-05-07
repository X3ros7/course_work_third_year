import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { MailgunConfigService } from '@app/config';
import { SendMailParams } from '@app/interfaces';

/**
 * Service for working with Mailgun API for sending email letters
 */
@Injectable()
export class MailgunService {
  private readonly logger: Logger = new Logger(MailgunService.name);
  constructor(
    private readonly config: MailgunConfigService,
    private readonly http: HttpService,
  ) {}

  async send(params: SendMailParams): Promise<void> {
    let data: any;
    if (params.template) {
      data = {
        from: this.config.from,
        to: params.to,
        subject: params.subject,
        template: params.template,
        'h:X-Mailgun-Variables': JSON.stringify({
          ...params.vars,
        }),
        attachment: params.attachments,
      };
    } else if (params.html) {
      data = {
        from: this.config.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        attachment: params.attachments,
      };
    }

    try {
      const headers = { 'content-type': 'application/x-www-form-urlencoded' };

      this.logger.log('Sending email...');

      await this.http.axiosRef.post(this.config.apiUrl, data, {
        auth: { username: 'api', password: this.config.apiKey },
        headers,
      });
    } catch (err) {
      this.logger.error(`Error while sending email to ${params.to}: ${err}`);
    }
  }
}

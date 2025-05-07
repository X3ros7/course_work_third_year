import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { TwilioConfigService } from '@app/config';

@Injectable()
export class TwilioService {
  private readonly logger: Logger = new Logger(TwilioService.name);

  constructor(
    private readonly config: TwilioConfigService,
    private readonly http: HttpService,
  ) {}

  async sendSms(to: string, body: string) {
    try {
      const headers = { 'content-type': 'application/x-www-form-urlencoded' };
      this.logger.debug(`Sending message to ${to}...`);
      await this.http.axiosRef.post(
        this.config.apiUrl,
        {
          From: this.config.from,
          To: to,
          Body: body,
        },
        {
          auth: {
            username: this.config.accountSid,
            password: this.config.authToken,
          },
          headers,
        },
      );
      this.logger.log('Message sent!');
    } catch (err) {
      this.logger.error(`Error while sending SMS: ${err}`);
    }
  }
}

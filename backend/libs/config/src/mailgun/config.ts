import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('mail', () => ({
  apiKey: env.MAILGUN_API_KEY,
  apiUrl: env.MAILGUN_API_URL,
  domain: env.MAILGUN_DOMAIN,
  from: env.MAIL_FROM,
}));

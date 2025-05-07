import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('twilio', () => ({
  accountSid: env.TWILIO_ACCOUNT_SID,
  authToken: env.TWILIO_AUTH_TOKEN,
  from: env.TWILIO_FROM,
}));

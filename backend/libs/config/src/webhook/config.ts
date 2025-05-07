import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('webhook', () => ({
  stripe: env.STRIPE_WEBHOOK_SECRET,
}));

import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('stripe', () => ({
  secret: env.STRIPE_SECRET_KEY,
  publish: env.STRIPE_PUBLISH_KEY,
  redirectUrl: env.STRIPE_REDIRECT_URL,
}));

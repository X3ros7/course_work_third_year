import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('google', () => ({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: env.GOOGLE_REDIRECT_URI,
}));

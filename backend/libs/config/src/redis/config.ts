import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('redis', () => ({
  host: env.REDIS_HOST,
  user: env.REDIS_USER,
  password: env.REDIS_PASSWORD,
  port: env.REDIS_PORT,
}));

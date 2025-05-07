import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('app', () => ({
  env: env.ENVIRONMENT,
  host: env.HOST,
  port: env.PORT,
}));

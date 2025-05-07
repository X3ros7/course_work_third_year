import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('db', () => ({
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
}));

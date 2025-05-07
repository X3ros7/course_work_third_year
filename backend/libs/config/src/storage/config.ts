import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('storage', () => ({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
}));

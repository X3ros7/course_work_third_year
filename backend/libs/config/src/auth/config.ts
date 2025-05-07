import { registerAs } from '@nestjs/config';

import { env } from 'node:process';

export default registerAs('auth', () => ({
  secret: env.JWT_SECRET,
  iss: env.JWT_ISS,
  accessExpiresInMinutes: env.JWT_ACCESS_EXPIRES_IN_MINUTES,
  refreshExpiresInMinutes: env.JWT_REFRESH_EXPIRES_IN_MINUTES,
}));

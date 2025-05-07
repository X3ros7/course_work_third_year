import * as dotenv from 'dotenv';
import { env } from 'node:process';
dotenv.config();

export default {
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: !!env.DB_TYPEORM_SYNCHRONIZE || false,
  logging: !!env.DB_TYPEORM_LOGGING || false,
  migrations: [env.DB_TYPEORM_MIGRATIONS || 'database/migration/**/*.ts'],
  migrationsTableName: 'migrations',
  entities: ['libs/entities/src/**/*.entity.ts'],
};

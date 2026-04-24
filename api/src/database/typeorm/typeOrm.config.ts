import { config } from 'dotenv';
import { resolve } from 'path';
import { getEnvPath } from '../../common/helper/env.helper';
import { DataSourceOptions } from 'typeorm';

const envFilePath: string = getEnvPath(
  resolve(process.cwd(), 'dist/common/envs'),
);

// Only load from file if it exists; in production, env vars are injected
if (envFilePath) {
  config({ path: envFilePath });
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  database: process.env.DATABASE_NAME || 'ecommercedb',
  username: process.env.DATABASE_USER || 'hassan',
  password: process.env.DATABASE_PASSWORD || '',
  entities: [process.env.DATABASE_ENTITIES || 'dist/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migration/history/*.js'],
  logger: 'simple-console',
  synchronize: false, // never use TRUE in production!
  logging: ['error', 'warn'], // only log errors and warnings
};

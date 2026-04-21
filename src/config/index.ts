import { getEnvPath } from 'src/common/helper/env.helper';
import { config } from 'dotenv';
import { resolve } from 'path';

const envFilePath: string = getEnvPath(resolve(__dirname, '..', 'common/envs'));

config({ path: envFilePath });

// S1: Determina si estamos en producción
const isProduction = process.env.NODE_ENV === 'production';

// S2: Helper para requerir vars solo en producción
const requireInProduction = (key: string, fallback: string): string => {
  if (isProduction && !process.env[key]) {
    throw new Error(`${key} environment variable is required in production`);
  }
  return process.env[key] || fallback;
};

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME || 'ecommercedb',
    user: process.env.DATABASE_USER || 'hassan',
    password: process.env.DATABASE_PASSWORD || 'password',
    entities: process.env.DATABASE_ENTITIES || 'dist/**/*.entity.{ts,js}',
  },
  jwt: {
    // S1: En producción requiere JWT_SECRET, en dev usa fallback seguro
    secret: requireInProduction('JWT_SECRET', 'dev-secret-not-for-production'),
  },
  adminUser: {
    // S2: En producción requiere ADMIN_EMAIL, en dev usa default
    email: requireInProduction('ADMIN_EMAIL', 'admin@admin.com'),
    // S2: En producción requiere ADMIN_PASSWORD, en dev usa default
    password: requireInProduction('ADMIN_PASSWORD', '12345678'),
  },
});

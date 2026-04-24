import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : 'development.env';
  let filePath: string = resolve(`${dest}/${filename}`);
  
  if (!existsSync(filePath)) {
    filePath = fallback;
  }
  
  // Return null or undefined if file doesn't exist (dotenv will handle it gracefully)
  if (!existsSync(filePath)) {
    return null;
  }
  
  return filePath;
}

import { Context } from 'hono';
import { AppwriteEnv } from './appwrite';

export const generateOrderId = (): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `#CLAP${randomNum}`;
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-');
};

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getDbId = (c: Context): string => {
  const env = (c.env || {}) as Record<string, string | undefined>;
  return env.APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || 'clapculture_db';
};

export const getEnv = (c: Context): AppwriteEnv => {
  return c.env && Object.keys(c.env).length > 0 ? (c.env as AppwriteEnv) : (process.env as AppwriteEnv);
};

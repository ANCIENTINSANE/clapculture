import { Context } from 'hono';
import { Query, Databases } from 'node-appwrite';
import { AppwriteEnv } from './appwrite';

export const getNextSequentialOrderId = async (databases: Databases, dbId: string): Promise<string> => {
  try {
    const list = await databases.listDocuments(dbId, 'orders', [
      Query.limit(100),
      Query.orderDesc('$createdAt'),
    ]);

    let highestSeq = 1000;
    for (const doc of list.documents) {
      const raw = String(doc.orderId || '').replace('#', '').trim();
      const match = raw.match(/^CLAP0?(\d{4,})$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= 1000 && num < 100000 && num > highestSeq) {
          highestSeq = num;
        }
      }
    }

    const nextNum = highestSeq + 1;
    const padded = String(nextNum).padStart(5, '0');
    return `#CLAP${padded}`;
  } catch {
    return '#CLAP01001';
  }
};

export const generateOrderId = (): string => {
  return '#CLAP01001';
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

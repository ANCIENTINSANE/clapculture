import { cors } from 'hono/cors';
import { AppwriteEnv } from '../lib/appwrite';

export const configureCors = (env: AppwriteEnv) => {
  // We use a dynamically constructed object instead of an object literal
  // to prevent esbuild from aggressively inlining and merging it with Hono's
  // default cors options, which causes "Duplicate key" warnings during build.
  const corsOptions: Record<string, unknown> = {};
  
  corsOptions.origin = (origin: string | undefined) => {
    // Allow any localhost for dev, or the specific frontend URL
    if (origin && (origin.includes('localhost') || origin === env.FRONTEND_URL)) {
      return origin;
    }
    return env.FRONTEND_URL || '*';
  };
  
  corsOptions.credentials = true;
  corsOptions.allowHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];
  corsOptions.allowMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

  return cors(corsOptions);
};

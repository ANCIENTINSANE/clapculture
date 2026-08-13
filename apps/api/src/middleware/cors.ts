import { cors } from 'hono/cors';

export const configureCors = (env: any) => {
  return cors({
    origin: (origin) => {
      // Allow any localhost for dev, or the specific frontend URL
      if (origin && (origin.includes('localhost') || origin === env.FRONTEND_URL)) {
        return origin;
      }
      return env.FRONTEND_URL;
    },
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
};

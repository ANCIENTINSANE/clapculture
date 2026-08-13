import { serve } from '@hono/node-server';
import app from './index';

// Populate fallback env vars for local node dev
process.env.APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
process.env.APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID";
process.env.APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || "YOUR_API_KEY";
process.env.APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "YOUR_DATABASE_ID";
process.env.JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET";
process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const port = Number(process.env.PORT) || 8787;
console.log(`🚀 CLAPCULTURE Hono API running locally on http://localhost:${port}`);

serve({
  fetch: (req) => {
    return app.fetch(req, process.env);
  },
  port
});

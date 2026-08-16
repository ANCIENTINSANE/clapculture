import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';

const search = new Hono();

search.get('/', async (c) => {
  try {
    const q = c.req.query('q');
    if (!q) {
      return c.json({ success: true, data: [] });
    }
    
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'products',
      [Query.search('name', q), Query.limit(20)]
    );
    
    const isProductActive = (d: Record<string, unknown>) => {
      if (d.isActive === false) return false;
      if (Array.isArray(d.badges)) {
        if (d.badges.includes('HIDDEN') || d.badges.includes('DISABLED')) return false;
      }
      return true;
    };
    
    return c.json({ success: true, data: response.documents.filter(isProductActive) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default search;

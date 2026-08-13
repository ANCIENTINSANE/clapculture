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
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default search;

import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { Env } from '@clapculture/shared';

const search = new Hono<{ Bindings: Env }>();

search.get('/', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const query = c.req.query('q');
    
    if (!query) {
      return c.json({ success: true, data: [] });
    }
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'products',
      [
        Query.search('name', query),
        Query.limit(20)
      ]
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default search;

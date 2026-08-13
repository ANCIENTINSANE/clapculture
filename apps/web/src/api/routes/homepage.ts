import { Hono } from 'hono';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';
import { Query } from 'node-appwrite';

const homepage = new Hono();

homepage.get('/', async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'homepage_sections',
      [Query.orderAsc('order')]
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

homepage.put('/', adminAuth, async (c) => {
  try {
    const { sections } = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const results = [];
    for (const section of (sections || [])) {
      if (section.$id) {
        const updated = await databases.updateDocument(
          dbId,
          'homepage_sections',
          section.$id,
          section
        );
        results.push(updated);
      }
    }
    
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default homepage;

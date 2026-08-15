import { Hono } from 'hono';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';
import { getCached, setCached, clearCache } from '../lib/cache';

const homepage = new Hono();

// GET /api/homepage - Fetch homepage configuration
homepage.get('/', async (c) => {
  try {
    const refresh = c.req.query('refresh') === 'true';
    if (!refresh) {
      const cached = getCached('homepage_config_all');
      if (cached) {
        c.header('X-Cache', 'HIT');
        return c.json({ success: true, data: cached });
      }
    }

    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    // Try to fetch the single consolidated homepage_config document
    try {
      const doc = await databases.getDocument(dbId, 'homepage_sections', 'homepage_config');
      if (doc && doc.content) {
        const parsed = typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content;
        setCached('homepage_config_all', parsed, 300); // 5 min cache
        c.header('X-Cache', 'MISS');
        return c.json({ success: true, data: parsed });
      }
    } catch {
      // If single doc not found, list documents
      const response = await databases.listDocuments(dbId, 'homepage_sections');
      if (response.documents.length > 0) {
        const cfgDoc = response.documents.find(d => d.$id === 'homepage_config' || d.type === 'homepage_config');
        if (cfgDoc && cfgDoc.content) {
          const parsed = typeof cfgDoc.content === 'string' ? JSON.parse(cfgDoc.content) : cfgDoc.content;
          setCached('homepage_config_all', parsed, 300);
          c.header('X-Cache', 'MISS');
          return c.json({ success: true, data: parsed });
        }
      }
    }

    c.header('X-Cache', 'MISS');
    return c.json({ success: true, data: null });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

// PUT /api/homepage - Save full homepage configuration (Admin)
homepage.put('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const contentString = JSON.stringify(body);

    let result;
    try {
      result = await databases.updateDocument(
        dbId,
        'homepage_sections',
        'homepage_config',
        {
          type: 'homepage_config',
          title: 'Homepage Configuration',
          content: contentString,
          order: 0,
        }
      );
    } catch {
      // If doesn't exist, create it
      result = await databases.createDocument(
        dbId,
        'homepage_sections',
        'homepage_config',
        {
          type: 'homepage_config',
          title: 'Homepage Configuration',
          content: contentString,
          order: 0,
        }
      );
    }

    clearCache('homepage');
    clearCache('bootstrap');
    return c.json({ success: true, data: result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default homepage;

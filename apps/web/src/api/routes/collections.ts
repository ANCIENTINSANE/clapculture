import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';
import { getCached, setCached, clearCache } from '../lib/cache';

const collections = new Hono();

collections.get('/', async (c) => {
  try {
    const cached = getCached('collections_all');
    if (cached) {
      c.header('X-Cache', 'HIT');
      return c.json({ success: true, data: cached });
    }

    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'collections'
    );
    
    setCached('collections_all', response.documents, 120);
    c.header('X-Cache', 'MISS');
    return c.json({ success: true, data: response.documents });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

collections.get('/:slug', async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    const slug = c.req.param('slug') || '';
    
    const response = await databases.listDocuments(
      dbId,
      'collections',
      [Query.equal('slug', slug), Query.limit(1)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Collection not found' }, 404);
    }
    
    const collectionData = response.documents[0] as Record<string, unknown>;
    
    const pIds = Array.isArray(collectionData.productIds) ? collectionData.productIds : [];
    if (pIds.length > 0) {
      const productsRes = await databases.listDocuments(
        dbId,
        'products',
        [Query.equal('$id', pIds)]
      );
      collectionData.products = productsRes.documents;
    } else {
      collectionData.products = [];
    }
    
    return c.json({ success: true, data: collectionData });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

collections.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.createDocument(
      dbId,
      'collections',
      ID.unique(),
      body
    );
    
    clearCache('collections');
    return c.json({ success: true, data: response }, 201);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

collections.put('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.updateDocument(
      dbId,
      'collections',
      id,
      body
    );
    
    clearCache('collections');
    return c.json({ success: true, data: response });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

collections.delete('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    await databases.deleteDocument(
      dbId,
      'collections',
      id
    );
    
    clearCache('collections');
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default collections;

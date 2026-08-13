import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';

const collections = new Hono();

collections.get('/', async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'collections'
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
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
    
    const collectionData: any = response.documents[0];
    
    if (collectionData.productIds && collectionData.productIds.length > 0) {
      const productsRes = await databases.listDocuments(
        dbId,
        'products',
        [Query.equal('$id', collectionData.productIds)]
      );
      collectionData.products = productsRes.documents;
    } else {
      collectionData.products = [];
    }
    
    return c.json({ success: true, data: collectionData });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
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
    
    return c.json({ success: true, data: response }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
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
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
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
    
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default collections;

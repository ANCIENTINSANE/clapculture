import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { adminAuth } from '../middleware/auth';
import { Env } from '@clapculture/shared';

const collections = new Hono<{ Bindings: Env }>();

collections.get('/', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'collections',
      [Query.orderAsc('order')]
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

collections.get('/:slug', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const slug = c.req.param('slug');
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'collections',
      [Query.equal('slug', slug), Query.limit(1)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Collection not found' }, 404);
    }
    
    const collection = response.documents[0];
    
    // Fetch related products
    if (collection.productIds && collection.productIds.length > 0) {
      const productsResp = await databases.listDocuments(
        c.env.APPWRITE_DATABASE_ID,
        'products',
        [Query.equal('$id', collection.productIds)]
      );
      collection.products = productsResp.documents;
    } else {
      collection.products = [];
    }
    
    return c.json({ success: true, data: collection });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

collections.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const response = await databases.createDocument(
      c.env.APPWRITE_DATABASE_ID,
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
    const id = c.req.param('id');
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const response = await databases.updateDocument(
      c.env.APPWRITE_DATABASE_ID,
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
    const id = c.req.param('id');
    const { databases } = getAppwriteClient(c.env);
    
    await databases.deleteDocument(
      c.env.APPWRITE_DATABASE_ID,
      'collections',
      id
    );
    
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default collections;

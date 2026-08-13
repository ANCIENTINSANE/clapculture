import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { adminAuth } from '../middleware/auth';
import { Env, Product } from '@clapculture/shared';

const products = new Hono<{ Bindings: Env }>();

products.get('/', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const category = c.req.query('category');
    const search = c.req.query('search');
    const limit = parseInt(c.req.query('limit') || '20');
    
    const queries = [Query.limit(limit)];
    if (category) queries.push(Query.equal('category', category));
    if (search) queries.push(Query.search('name', search));
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'products',
      queries
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

products.get('/:slug', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const slug = c.req.param('slug');
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'products',
      [Query.equal('slug', slug), Query.limit(1)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    
    return c.json({ success: true, data: response.documents[0] });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

products.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    body.createdAt = new Date().toISOString();
    
    const response = await databases.createDocument(
      c.env.APPWRITE_DATABASE_ID,
      'products',
      ID.unique(),
      body
    );
    
    return c.json({ success: true, data: response }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

products.put('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const response = await databases.updateDocument(
      c.env.APPWRITE_DATABASE_ID,
      'products',
      id,
      body
    );
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

products.delete('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const { databases } = getAppwriteClient(c.env);
    
    await databases.deleteDocument(
      c.env.APPWRITE_DATABASE_ID,
      'products',
      id
    );
    
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default products;

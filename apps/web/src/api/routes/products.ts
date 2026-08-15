import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';
import { getCached, setCached, clearCache } from '../lib/cache';

const products = new Hono();

products.get('/', async (c) => {
  try {
    const category = c.req.query('category') || '';
    const search = c.req.query('search') || '';
    const limit = parseInt(c.req.query('limit') || '20');
    const cacheKey = `products_${category}_${search}_${limit}`;

    const cachedData = getCached(cacheKey);
    if (cachedData) {
      c.header('X-Cache', 'HIT');
      return c.json({ success: true, data: cachedData });
    }

    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const queries = [Query.limit(limit)];
    if (category) queries.push(Query.equal('category', category));
    if (search) queries.push(Query.search('name', search));
    
    const response = await databases.listDocuments(
      dbId,
      'products',
      queries
    );
    
    setCached(cacheKey, response.documents, 60);
    c.header('X-Cache', 'MISS');
    return c.json({ success: true, data: response.documents });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

// Check slug availability
products.get('/check/slug', async (c) => {
  try {
    const slug = (c.req.query('slug') || '').trim().toLowerCase();
    const excludeId = (c.req.query('excludeId') || '').trim();

    if (!slug) {
      return c.json({ success: true, available: false, message: 'Slug is required' });
    }

    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);

    const response = await databases.listDocuments(dbId, 'products', [
      Query.equal('slug', slug),
      Query.limit(5),
    ]);

    const matching = response.documents.filter(d => d.$id !== excludeId && d.id !== excludeId);
    const available = matching.length === 0;

    return c.json({
      success: true,
      available,
      existingProduct: available ? null : { name: matching[0].name, id: matching[0].$id, slug: matching[0].slug },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

products.get('/:slug', async (c) => {
  try {
    const slugOrId = c.req.param('slug') || '';
    const cacheKey = `product_${slugOrId}`;

    const cachedData = getCached(cacheKey);
    if (cachedData) {
      c.header('X-Cache', 'HIT');
      return c.json({ success: true, data: cachedData });
    }

    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    // 1. Try fetching by document ID first
    try {
      const doc = await databases.getDocument(dbId, 'products', slugOrId);
      if (doc) {
        setCached(cacheKey, doc, 60);
        c.header('X-Cache', 'MISS');
        return c.json({ success: true, data: doc });
      }
    } catch {
      // If getDocument fails (not found as direct doc ID), query by slug
    }

    // 2. Query by slug
    const response = await databases.listDocuments(
      dbId,
      'products',
      [Query.equal('slug', slugOrId), Query.limit(1)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    
    setCached(cacheKey, response.documents[0], 60);
    c.header('X-Cache', 'MISS');
    return c.json({ success: true, data: response.documents[0] });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

products.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    body.createdAt = new Date().toISOString();
    
    const response = await databases.createDocument(
      dbId,
      'products',
      ID.unique(),
      body
    );
    
    clearCache('products');
    clearCache('product');
    clearCache('bootstrap');
    return c.json({ success: true, data: response }, 201);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

products.put('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.updateDocument(
      dbId,
      'products',
      id,
      body
    );
    
    clearCache('products');
    clearCache('product');
    clearCache('bootstrap');
    return c.json({ success: true, data: response });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

products.delete('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    await databases.deleteDocument(
      dbId,
      'products',
      id
    );
    
    clearCache('products');
    clearCache('product');
    clearCache('bootstrap');
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default products;

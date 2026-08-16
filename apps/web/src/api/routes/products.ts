import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';
import { getCached, setCached, clearCache } from '../lib/cache';

const products = new Hono();

function isProductActive(p: Record<string, unknown>): boolean {
  if (p.isActive === false) return false;
  if (Array.isArray(p.badges)) {
    if (p.badges.includes('HIDDEN') || p.badges.includes('DISABLED')) return false;
  }
  return true;
}

products.get('/', async (c) => {
  try {
    const category = c.req.query('category') || '';
    const search = c.req.query('search') || '';
    const limit = parseInt(c.req.query('limit') || '100');
    const includeHidden = c.req.query('includeHidden') === 'true';
    const cacheKey = `products_${category}_${search}_${limit}_${includeHidden}`;

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
    
    const documents = includeHidden 
      ? response.documents 
      : response.documents.filter(isProductActive);
    
    setCached(cacheKey, documents, 60);
    c.header('X-Cache', 'MISS');
    return c.json({ success: true, data: documents });
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
    const includeHidden = c.req.query('includeHidden') === 'true';
    const cacheKey = `product_${slugOrId}_${includeHidden}`;

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
        if (!includeHidden && !isProductActive(doc)) {
          return c.json({ success: false, error: 'Product not found' }, 404);
        }
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
    
    const productDoc = response.documents[0];
    if (!includeHidden && !isProductActive(productDoc)) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    
    setCached(cacheKey, productDoc, 60);
    c.header('X-Cache', 'MISS');
    return c.json({ success: true, data: productDoc });
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
    if (body.isActive === undefined) {
      body.isActive = true;
    }
    
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

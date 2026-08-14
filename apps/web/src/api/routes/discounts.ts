import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';

const discounts = new Hono();

discounts.post('/validate', async (c) => {
  try {
    const { code } = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'discounts',
      [Query.equal('code', (code || '').toUpperCase()), Query.equal('active', true), Query.limit(1)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Invalid discount code' }, 404);
    }
    
    const discount = response.documents[0] as Record<string, unknown>;
    
    if (typeof discount.expiry === "string" && new Date(discount.expiry) < new Date()) {
      return c.json({ success: false, error: 'Discount code expired' }, 400);
    }
    
    if (discount.usageLimit && Number(discount.usageCount) >= Number(discount.usageLimit)) {
      return c.json({ success: false, error: 'Discount usage limit reached' }, 400);
    }
    
    return c.json({ success: true, data: discount });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

discounts.get('/', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'discounts'
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

discounts.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    body.code = (body.code || '').toUpperCase();
    body.usageCount = 0;
    
    const response = await databases.createDocument(
      dbId,
      'discounts',
      ID.unique(),
      body
    );
    
    return c.json({ success: true, data: response }, 201);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

discounts.put('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    if (body.code) body.code = body.code.toUpperCase();
    
    const response = await databases.updateDocument(
      dbId,
      'discounts',
      id,
      body
    );
    
    return c.json({ success: true, data: response });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

discounts.delete('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    await databases.deleteDocument(
      dbId,
      'discounts',
      id
    );
    
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default discounts;

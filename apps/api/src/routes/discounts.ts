import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { adminAuth } from '../middleware/auth';
import { Env } from '@clapculture/shared';

const discounts = new Hono<{ Bindings: Env }>();

discounts.get('/', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'discounts'
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

discounts.get('/validate/:code', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const code = c.req.param('code');
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'discounts',
      [Query.equal('code', code), Query.equal('active', true)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Invalid or inactive discount code' }, 404);
    }
    
    const discount = response.documents[0];
    const now = new Date().toISOString();
    
    if (discount.expiry && discount.expiry < now) {
      return c.json({ success: false, error: 'Discount code has expired' }, 400);
    }
    
    if (discount.usageLimit > 0 && discount.usageCount >= discount.usageLimit) {
      return c.json({ success: false, error: 'Discount code usage limit reached' }, 400);
    }
    
    return c.json({ success: true, data: discount });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

discounts.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const response = await databases.createDocument(
      c.env.APPWRITE_DATABASE_ID,
      'discounts',
      ID.unique(),
      { ...body, usageCount: 0 }
    );
    
    return c.json({ success: true, data: response }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

discounts.put('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const response = await databases.updateDocument(
      c.env.APPWRITE_DATABASE_ID,
      'discounts',
      id,
      body
    );
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

discounts.delete('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const { databases } = getAppwriteClient(c.env);
    
    await databases.deleteDocument(
      c.env.APPWRITE_DATABASE_ID,
      'discounts',
      id
    );
    
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default discounts;

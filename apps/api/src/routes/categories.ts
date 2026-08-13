import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { adminAuth } from '../middleware/auth';
import { Env } from '@clapculture/shared';

const categories = new Hono<{ Bindings: Env }>();

categories.get('/', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'categories',
      [Query.orderAsc('order')]
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

categories.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const response = await databases.createDocument(
      c.env.APPWRITE_DATABASE_ID,
      'categories',
      ID.unique(),
      body
    );
    
    return c.json({ success: true, data: response }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

categories.put('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const response = await databases.updateDocument(
      c.env.APPWRITE_DATABASE_ID,
      'categories',
      id,
      body
    );
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

categories.delete('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const { databases } = getAppwriteClient(c.env);
    
    await databases.deleteDocument(
      c.env.APPWRITE_DATABASE_ID,
      'categories',
      id
    );
    
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default categories;

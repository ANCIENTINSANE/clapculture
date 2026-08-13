import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { adminAuth } from '../middleware/auth';
import { Env } from '@clapculture/shared';

const settings = new Hono<{ Bindings: Env }>();

// Public subset of settings (like store status, announcement banner)
settings.get('/', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'settings',
      [Query.equal('public', true)]
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// All settings for admin
settings.get('/admin', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'settings'
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

settings.put('/:key', adminAuth, async (c) => {
  try {
    const key = c.req.param('key');
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const findSetting = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'settings',
      [Query.equal('key', key)]
    );
    
    let response;
    if (findSetting.documents.length > 0) {
      response = await databases.updateDocument(
        c.env.APPWRITE_DATABASE_ID,
        'settings',
        findSetting.documents[0].$id,
        { value: body.value }
      );
    } else {
      response = await databases.createDocument(
        c.env.APPWRITE_DATABASE_ID,
        'settings',
        ID.unique(),
        { key, value: body.value, public: body.public || false }
      );
    }
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default settings;

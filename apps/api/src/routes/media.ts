import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import { uploadFile, getFileUrl } from '../lib/storage';
import { getAppwriteClient } from '../lib/appwrite';
import { Env } from '@clapculture/shared';

const media = new Hono<{ Bindings: Env }>();
const BUCKET_ID = 'media_bucket'; // Replace with actual bucket ID if dynamic

media.post('/upload', adminAuth, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file uploaded' }, 400);
    }
    
    const response = await uploadFile(c.env, BUCKET_ID, file);
    const url = getFileUrl(c.env, BUCKET_ID, response.$id);
    
    return c.json({ 
      success: true, 
      data: {
        fileId: response.$id,
        url,
        name: response.name,
        size: response.sizeOriginal
      }
    }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

media.get('/', adminAuth, async (c) => {
  try {
    const { storage } = getAppwriteClient(c.env);
    const response = await storage.listFiles(BUCKET_ID);
    
    const files = response.files.map(file => ({
      ...file,
      url: getFileUrl(c.env, BUCKET_ID, file.$id)
    }));
    
    return c.json({ success: true, data: files });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

media.delete('/:fileId', adminAuth, async (c) => {
  try {
    const fileId = c.req.param('fileId');
    const { storage } = getAppwriteClient(c.env);
    
    await storage.deleteFile(BUCKET_ID, fileId);
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default media;

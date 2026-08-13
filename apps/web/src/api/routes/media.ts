import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import { uploadFile, getFileUrl } from '../lib/storage';
import { getAppwriteClient } from '../lib/appwrite';
import { getEnv } from '../lib/utils';
import { processAndCompressImage } from '../lib/image';

const media = new Hono();
const BUCKET_ID = 'media';

media.post('/upload', adminAuth, async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }
    
    const env = getEnv(c);

    // Process & Compress Image into WebP format under 200KB
    let uploadPayload: any = file;
    if (file.type.startsWith('image/')) {
      const processed = await processAndCompressImage(file);
      uploadPayload = processed;
    }

    const uploaded = await uploadFile(env, BUCKET_ID, uploadPayload);
    const url = getFileUrl(env, BUCKET_ID, uploaded.$id);
    
    return c.json({ 
      success: true, 
      data: {
        id: uploaded.$id,
        name: uploaded.name,
        size: uploaded.sizeOriginal,
        type: uploaded.mimeType,
        url,
        optimized: true,
        format: 'webp'
      } 
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

media.get('/', adminAuth, async (c) => {
  try {
    const env = getEnv(c);
    const { storage } = getAppwriteClient(env);
    const response = await storage.listFiles(BUCKET_ID);
    
    const files = response.files.map(f => ({
      id: f.$id,
      name: f.name,
      size: f.sizeOriginal,
      type: f.mimeType,
      url: getFileUrl(env, BUCKET_ID, f.$id),
      createdAt: f.$createdAt
    }));
    
    return c.json({ success: true, data: files });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

media.delete('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const { storage } = getAppwriteClient(getEnv(c));
    
    await storage.deleteFile(BUCKET_ID, id);
    
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default media;

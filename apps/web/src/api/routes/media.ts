import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import { uploadFile, getFileUrl } from '../lib/storage';
import { getAppwriteClient } from '../lib/appwrite';
import { getEnv } from '../lib/utils';
import { processAndCompressImage } from '../lib/image';

const media = new Hono();
const BUCKET_ID = 'media';

// Public CDN-cached image proxy for Appwrite storage files
media.get('/file/:id', async (c) => {
  try {
    const id = c.req.param('id') || '';
    if (!id) {
      return c.json({ error: 'File ID required' }, 400);
    }

    const env = getEnv(c);
    const endpoint = env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
    const projectId = env.APPWRITE_PROJECT_ID || '6a7dfa97003713198186';
    
    const appwriteUrl = `${endpoint}/storage/buckets/${BUCKET_ID}/files/${id}/view?project=${projectId}`;
    
    const res = await fetch(appwriteUrl);
    if (!res.ok) {
      return c.json({ error: 'Image not found' }, res.status as any);
    }
    
    const contentType = res.headers.get('content-type') || 'image/webp';
    const body = await res.arrayBuffer();
    
    return c.body(body, 200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'CDN-Cache-Control': 'public, max-age=31536000, immutable',
      'Cloudflare-CDN-Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error streaming image';
    return c.json({ error: msg }, 500);
  }
});

media.post('/upload', adminAuth, async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }
    
    const env = getEnv(c);

    let uploadPayload: File = file;

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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

media.delete('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const { storage } = getAppwriteClient(getEnv(c));
    
    await storage.deleteFile(BUCKET_ID, id);
    
    return c.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default media;

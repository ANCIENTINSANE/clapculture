import { Hono } from 'hono';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { uploadFile, getFileUrl } from '../lib/storage';

const payments = new Hono();

// Public payment proof upload endpoint (used by customers during checkout)
payments.post('/upload-proof', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;

    if (!file) {
      return c.json({ success: false, error: 'No screenshot file provided' }, 400);
    }

    const env = getEnv(c);
    const BUCKET_ID = 'media';
    const uploaded = await uploadFile(env, BUCKET_ID, file);
    const url = getFileUrl(env, BUCKET_ID, uploaded.$id);

    return c.json({
      success: true,
      data: {
        fileId: uploaded.$id,
        url,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Screenshot upload failed';
    return c.json({ success: false, error: msg }, 500);
  }
});

payments.post('/submit', async (c) => {
  try {
    const { orderId, transactionId, screenshotUrl } = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.updateDocument(
      dbId,
      'orders',
      orderId,
      {
        paymentStatus: 'SUBMITTED',
        transactionId,
        screenshotUrl,
        submittedAt: new Date().toISOString()
      }
    );
    
    return c.json({ success: true, data: response });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

payments.post('/verify', async (c) => {
  try {
    const { orderId, approved } = await c.req.json();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const paymentStatus = approved ? 'VERIFIED' : 'REJECTED';
    const orderStatus = approved ? 'CONFIRMED' : 'CANCELLED';
    
    const response = await databases.updateDocument(
      dbId,
      'orders',
      orderId,
      {
        paymentStatus,
        orderStatus,
        verifiedAt: new Date().toISOString()
      }
    );
    
    return c.json({ success: true, data: response });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default payments;

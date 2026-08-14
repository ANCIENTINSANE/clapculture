import { Hono } from 'hono';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';

const payments = new Hono();

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

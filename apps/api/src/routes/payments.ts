import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { Env } from '@clapculture/shared';

const payments = new Hono<{ Bindings: Env }>();

payments.post('/:orderId/submit', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const orderId = c.req.param('orderId');
    const { fileId, transactionId } = await c.req.json();
    
    const findOrder = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      [Query.equal('orderId', orderId)]
    );
    
    if (findOrder.documents.length === 0) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }
    
    const docId = findOrder.documents[0].$id;
    
    const response = await databases.updateDocument(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      docId,
      {
        paymentScreenshot: fileId,
        transactionId,
        paymentStatus: 'SUBMITTED',
        updatedAt: new Date().toISOString()
      }
    );
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

payments.get('/:orderId/status', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const orderId = c.req.param('orderId');
    
    const findOrder = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      [Query.equal('orderId', orderId)]
    );
    
    if (findOrder.documents.length === 0) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }
    
    return c.json({ 
      success: true, 
      data: { paymentStatus: findOrder.documents[0].paymentStatus } 
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default payments;

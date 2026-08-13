import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { adminAuth } from '../middleware/auth';
import { generateOrderId } from '../lib/utils';
import { Env } from '@clapculture/shared';

const orders = new Hono<{ Bindings: Env }>();

orders.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { databases } = getAppwriteClient(c.env);
    
    const orderData = {
      ...body,
      orderId: generateOrderId(),
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const response = await databases.createDocument(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      ID.unique(),
      orderData
    );
    
    return c.json({ success: true, data: response }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.get('/:orderId', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const orderId = c.req.param('orderId');
    const emailOrPhone = c.req.query('verify'); // email or phone
    
    if (!emailOrPhone) {
      return c.json({ success: false, error: 'Verification required' }, 401);
    }
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      [Query.equal('orderId', orderId)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }
    
    const order = response.documents[0];
    
    // Verify customer
    if (order.customer.email !== emailOrPhone && order.customer.phone !== emailOrPhone) {
      return c.json({ success: false, error: 'Verification failed' }, 401);
    }
    
    return c.json({ success: true, data: order });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.get('/track', async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const orderId = c.req.query('orderId');
    const verify = c.req.query('verify');
    
    if (!orderId || !verify) {
      return c.json({ success: false, error: 'Missing orderId or verify info' }, 400);
    }
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      [Query.equal('orderId', orderId as string)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }
    
    const order = response.documents[0];
    
    if (order.customer.email !== verify && order.customer.phone !== verify) {
      return c.json({ success: false, error: 'Verification failed' }, 401);
    }
    
    return c.json({ 
      success: true, 
      data: {
        orderId: order.orderId,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        updatedAt: order.updatedAt
      } 
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.get('/admin/list', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const limit = parseInt(c.req.query('limit') || '20');
    const status = c.req.query('status');
    
    const queries = [Query.limit(limit), Query.orderDesc('createdAt')];
    if (status) queries.push(Query.equal('orderStatus', status));
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      queries
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.put('/admin/:orderId/status', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const orderId = c.req.param('orderId');
    const { status, trackingNumber } = await c.req.json();
    
    // find order by orderId
    const findOrder = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      [Query.equal('orderId', orderId)]
    );
    
    if (findOrder.documents.length === 0) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }
    
    const docId = findOrder.documents[0].$id;
    const updateData: any = { orderStatus: status, updatedAt: new Date().toISOString() };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    
    const response = await databases.updateDocument(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      docId,
      updateData
    );
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.put('/admin/:orderId/payment', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const orderId = c.req.param('orderId');
    const { status } = await c.req.json(); // VERIFIED or REJECTED
    
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
      { paymentStatus: status, updatedAt: new Date().toISOString() }
    );
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default orders;

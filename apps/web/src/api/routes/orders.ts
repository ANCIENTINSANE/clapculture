import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv, generateOrderId } from '../lib/utils';
import { adminAuth } from '../middleware/auth';
import { sendOrderConfirmationEmail, sendPaymentVerifiedEmail, sendShippingUpdateEmail } from '../lib/email';

const orders = new Hono();

orders.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const env = getEnv(c);
    const { databases } = getAppwriteClient(env);
    const dbId = getDbId(c);
    
    const customOrderId = body.orderId || generateOrderId();
    
    const orderData = {
      ...body,
      orderId: customOrderId,
      paymentStatus: body.paymentStatus || 'PENDING',
      orderStatus: body.orderStatus || 'PLACED',
      createdAt: new Date().toISOString()
    };
    
    const response = await databases.createDocument(
      dbId,
      'orders',
      ID.unique(),
      orderData
    );

    // Send Appwrite Messaging Order Confirmation Email
    const customerObj = typeof body.customer === 'string' ? JSON.parse(body.customer) : (body.customer || {});
    const itemsList = typeof body.items === 'string' ? JSON.parse(body.items) : (body.items || []);
    
    if (customerObj.email) {
      sendOrderConfirmationEmail(env, {
        toEmail: customerObj.email,
        customerName: customerObj.fullName || 'Valued Rebel',
        orderId: customOrderId.replace('#', ''),
        totalAmount: body.total || 0,
        items: itemsList,
        paymentStatus: orderData.paymentStatus,
        shippingAddress: `${customerObj.address || ''}, ${customerObj.city || ''}, ${customerObj.state || ''} ${customerObj.pincode || ''}`,
      }).catch((e) => console.log('Email notice:', e.message));
    }
    
    return c.json({ success: true, data: response }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.get('/track', async (c) => {
  try {
    const orderId = c.req.query('orderId');
    const contact = c.req.query('contact');
    
    if (!orderId || !contact) {
      return c.json({ success: false, error: 'Order ID and contact details required' }, 400);
    }
    
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'orders',
      [Query.equal('orderId', orderId.toUpperCase())]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }
    
    const order: any = response.documents[0];
    
    if (order.customer?.email !== contact && order.customer?.phone !== contact) {
      return c.json({ success: false, error: 'Contact details do not match order' }, 403);
    }
    
    return c.json({ success: true, data: order });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.get('/:orderId', async (c) => {
  try {
    const orderId = c.req.param('orderId') || '';
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'orders',
      [Query.equal('orderId', orderId.toUpperCase()), Query.limit(1)]
    );
    
    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }
    
    return c.json({ success: true, data: response.documents[0] });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.put('/:id/status', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const { orderStatus, paymentStatus, trackingNumber } = await c.req.json();
    const env = getEnv(c);
    const { databases } = getAppwriteClient(env);
    const dbId = getDbId(c);
    
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    
    const response: any = await databases.updateDocument(
      dbId,
      'orders',
      id,
      updateData
    );

    // Send corresponding Appwrite Messaging email on status change
    const customerObj = typeof response.customer === 'string' ? JSON.parse(response.customer) : (response.customer || {});
    if (customerObj.email) {
      if (paymentStatus === 'VERIFIED') {
        sendPaymentVerifiedEmail(env, {
          toEmail: customerObj.email,
          customerName: customerObj.fullName || 'Customer',
          orderId: response.orderId,
          transactionId: response.transactionId,
        }).catch(() => {});
      } else if (orderStatus === 'SHIPPED' && trackingNumber) {
        sendShippingUpdateEmail(env, {
          toEmail: customerObj.email,
          customerName: customerObj.fullName || 'Customer',
          orderId: response.orderId,
          trackingNumber,
        }).catch(() => {});
      }
    }
    
    return c.json({ success: true, data: response });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

orders.get('/', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    const status = c.req.query('status');
    const paymentStatus = c.req.query('paymentStatus');
    const limit = parseInt(c.req.query('limit') || '50');
    
    const queries = [Query.limit(limit), Query.orderDesc('$createdAt')];
    if (status) queries.push(Query.equal('orderStatus', status));
    if (paymentStatus) queries.push(Query.equal('paymentStatus', paymentStatus));
    
    const response = await databases.listDocuments(
      dbId,
      'orders',
      queries
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default orders;

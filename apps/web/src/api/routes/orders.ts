import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv, getNextSequentialOrderId } from '../lib/utils';
import { adminAuth } from '../middleware/auth';
import { upsertCustomerAndUser } from './customers';
import {
  sendOrderConfirmationEmail,
  sendPaymentVerifiedEmail,
  sendShippingUpdateEmail,
  sendOrderDeliveredEmail,
  sendAdminAlertEmail,
} from '../lib/email';

const orders = new Hono();

// Get the next sequential order ID (e.g. #CLAP01001)
orders.get('/next-id', async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    const orderId = await getNextSequentialOrderId(databases, dbId);
    return c.json({ success: true, data: { orderId } });
  } catch {
    return c.json({ success: true, data: { orderId: '#CLAP01001' } });
  }
});

orders.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const env = getEnv(c);
    const { databases } = getAppwriteClient(env);
    const dbId = getDbId(c);
    
    let customOrderId = body.orderId;
    if (!customOrderId) {
      customOrderId = await getNextSequentialOrderId(databases, dbId);
    }

    const customerObj = typeof body.customer === 'string' ? JSON.parse(body.customer) : (body.customer || {});
    if (body.screenshotUrl) customerObj.screenshotUrl = body.screenshotUrl;
    if (body.paymentProof) customerObj.paymentProof = body.paymentProof;
    const customerStr = JSON.stringify(customerObj);
    const itemsStr = typeof body.items === 'string' ? body.items : JSON.stringify(body.items || []);

    const orderData = {
      orderId: customOrderId,
      customer: customerStr,
      items: itemsStr,
      subtotal: Number(body.subtotal) || Number(body.total) || 0,
      shipping: Number(body.shipping) || 0,
      total: Number(body.total) || 0,
      paymentStatus: body.paymentStatus || 'SUBMITTED',
      orderStatus: body.orderStatus || 'PLACED',
      transactionId: body.transactionId || 'UPI-REF-PENDING',
      trackingNumber: body.trackingNumber || 'TRK-CLAP-PENDING',
    };
    
    const response = await databases.createDocument(
      dbId,
      'orders',
      ID.unique(),
      orderData
    );

    // Auto-save/sync customer profile and Appwrite Auth user
    if (customerObj.email) {
      upsertCustomerAndUser(env, {
        email: customerObj.email,
        fullName: customerObj.fullName,
        phone: customerObj.phone,
        address: customerObj.address,
        city: customerObj.city,
        state: customerObj.state,
        pincode: customerObj.pincode,
        orderId: customOrderId,
        source: 'order_checkout',
      }).catch((e) => console.log('Customer upsert notice:', e.message));
    }
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
      }).catch((e) => console.log('Email confirmation notice:', e.message));
    }

    // 2. Send Admin New Order Notification Email
    sendAdminAlertEmail(env, {
      subject: `New Order Placed #${customOrderId.replace('#', '')} (₹${body.total || 0})`,
      title: `NEW ORDER #${customOrderId.replace('#', '')}`,
      message: `A new order has been placed by ${customerObj.fullName || 'Customer'} for ₹${body.total || 0}.`,
      actionUrl: `/admin/orders/${customOrderId.replace('#', '')}`,
      actionText: 'VIEW ORDER IN ADMIN',
      metadata: {
        orderId: customOrderId,
        customer: `${customerObj.fullName} (${customerObj.email}, ${customerObj.phone})`,
        amount: `₹${body.total}`,
        itemsCount: itemsList.length,
      },
    }).catch((e) => console.log('Admin email alert notice:', e.message));
    
    return c.json({ success: true, data: response }, 201);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create order';
    return c.json({ success: false, error: msg }, 500);
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
    
    const order = response.documents[0] as Record<string, unknown>;
    const customer = (order.customer || {}) as Record<string, string | undefined>;
    
    if (customer.email !== contact && customer.phone !== contact) {
      return c.json({ success: false, error: 'Contact details do not match order' }, 403);
    }
    
    return c.json({ success: true, data: enrichOrderDoc(order) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to track order';
    return c.json({ success: false, error: msg }, 500);
  }
});

function enrichOrderDoc(doc: Record<string, unknown>) {
  let customerObj: Record<string, unknown> = {};
  if (typeof doc.customer === 'string') {
    try {
      customerObj = JSON.parse(doc.customer);
    } catch {}
  } else if (doc.customer && typeof doc.customer === 'object') {
    customerObj = doc.customer as Record<string, unknown>;
  }

  const screenshot = (customerObj.screenshotUrl || customerObj.paymentProof || doc.screenshotUrl || doc.paymentProof || '') as string;
  return {
    ...doc,
    screenshotUrl: screenshot,
    paymentProof: screenshot,
  };
}

orders.get('/:orderId', async (c) => {
  try {
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    const rawId = c.req.param('orderId') || '';
    const cleanId = rawId.replace('#', '').trim();
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    // 1. Try finding by document ID
    try {
      const doc = await databases.getDocument(dbId, 'orders', cleanId);
      if (doc) return c.json({ success: true, data: enrichOrderDoc(doc) });
    } catch {}

    // 2. Try querying by orderId (case-insensitive variations)
    const variations = [cleanId, `CLAP${cleanId}`, cleanId.toUpperCase(), `#${cleanId}`];
    for (const v of variations) {
      const response = await databases.listDocuments(
        dbId,
        'orders',
        [Query.equal('orderId', v), Query.limit(1)]
      );
      if (response.documents.length > 0) {
        return c.json({ success: true, data: enrichOrderDoc(response.documents[0]) });
      }
    }
    
    return c.json({ success: false, error: 'Order not found' }, 404);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to get order';
    return c.json({ success: false, error: msg }, 500);
  }
});

orders.put('/:id/status', adminAuth, async (c) => {
  try {
    const idOrOrderId = (c.req.param('id') || '').replace('#', '').trim();
    const { orderStatus, paymentStatus, trackingNumber } = await c.req.json();
    const env = getEnv(c);
    const { databases } = getAppwriteClient(env);
    const dbId = getDbId(c);
    
    let targetDocId = idOrOrderId;

    // Resolve real document ID if orderId was passed
    try {
      await databases.getDocument(dbId, 'orders', targetDocId);
    } catch {
      const variations = [idOrOrderId, `CLAP${idOrOrderId}`, idOrOrderId.toUpperCase(), `#${idOrOrderId}`];
      for (const v of variations) {
        const list = await databases.listDocuments(dbId, 'orders', [
          Query.equal('orderId', v),
          Query.limit(1)
        ]);
        if (list.documents.length > 0) {
          targetDocId = list.documents[0].$id;
          break;
        }
      }
    }
    
    const updateData: Record<string, unknown> = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    
    const response = await databases.updateDocument(
      dbId,
      'orders',
      targetDocId,
      updateData
    );

    // Send corresponding transactional email on status change via Gmail SMTP
    const customerObj = typeof (response as Record<string, unknown>).customer === 'string' 
      ? JSON.parse((response as Record<string, unknown>).customer as string) 
      : (((response as Record<string, unknown>).customer || {}) as Record<string, string | undefined>);

    if (customerObj.email) {
      const orderIdStr = String(response.orderId || targetDocId).replace('#', '');
      if (paymentStatus === 'VERIFIED') {
        sendPaymentVerifiedEmail(env, {
          toEmail: customerObj.email,
          customerName: customerObj.fullName || 'Valued Rebel',
          orderId: orderIdStr,
          transactionId: String(response.transactionId || ''),
        }).catch((e) => console.log('Payment verified email notice:', e.message));
      } else if (orderStatus === 'SHIPPED') {
        sendShippingUpdateEmail(env, {
          toEmail: customerObj.email,
          customerName: customerObj.fullName || 'Valued Rebel',
          orderId: orderIdStr,
          trackingNumber: trackingNumber || response.trackingNumber || 'TRK-CLAP-EXPRESS',
        }).catch((e) => console.log('Shipping update email notice:', e.message));
      } else if (orderStatus === 'DELIVERED') {
        sendOrderDeliveredEmail(env, {
          toEmail: customerObj.email,
          customerName: customerObj.fullName || 'Valued Rebel',
          orderId: orderIdStr,
        }).catch((e) => console.log('Delivered email notice:', e.message));
      }
    }
    
    return c.json({ success: true, data: response });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update order status';
    return c.json({ success: false, error: msg }, 500);
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
    
    return c.json({ success: true, data: response.documents.map((d) => enrichOrderDoc(d)) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to list orders';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default orders;

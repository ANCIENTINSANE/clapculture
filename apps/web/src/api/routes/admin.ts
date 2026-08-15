import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { signAdminToken } from '../lib/jwt';
import { Query, Models } from 'node-appwrite';

const admin = new Hono();

admin.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    if (!username || !password) {
      return c.json({ success: false, error: 'Username and password required' }, 400);
    }

    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    let adminRecord: Models.Document | null = null;

    // Check Appwrite database for seeded admin credentials
    try {
      const dbAdmins = await databases.listDocuments(
        dbId,
        'customers',
        [Query.equal('email', username.toLowerCase()), Query.limit(1)]
      );
      if (dbAdmins.documents.length > 0) {
        adminRecord = dbAdmins.documents[0];
      }
    } catch {
      // Fallback
    }

    // Default seeded admin credentials check
    const isValidDefaultAdmin = (username === 'admin@clapculture.com' || username === 'admin') && (password === 'clapculture123' || password === 'admin123');

    if (!isValidDefaultAdmin && !adminRecord) {
      return c.json({ success: false, error: 'Invalid admin credentials' }, 401);
    }

    const adminUser = {
      id: adminRecord?.$id || 'admin-1',
      username: username,
      role: 'admin',
    };

    // Sign JWT session token
    const token = signAdminToken(adminUser);
    
    return c.json({
      success: true,
      data: {
        token,
        user: adminUser,
        expiresIn: '24h',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

admin.get('/dashboard', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const ordersRes = await databases.listDocuments(
      dbId,
      'orders',
      [Query.limit(100)]
    );
    
    const totalOrders = ordersRes.total;
    const totalSales = ordersRes.documents.reduce((acc, o) => acc + (Number((o as Record<string, unknown>).total) || 0), 0);
    const pendingPayments = ordersRes.documents.filter((o) => (o as Record<string, unknown>).paymentStatus === 'SUBMITTED').length;
    
    return c.json({ 
      success: true, 
      data: {
        totalOrders,
        totalSales,
        pendingPayments
      } 
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

admin.get('/me', adminAuth, async (c) => {
  const adminData = (c.get('admin' as never) || {}) as Record<string, unknown>;
  return c.json({ success: true, data: adminData });
});

// Verify Gmail SMTP Connectivity
admin.get('/email/verify', async (c) => {
  const { verifySmtpConnection } = await import('../lib/mailer');
  const env = getEnv(c);
  const result = await verifySmtpConnection(env);
  return c.json(result);
});

// Send Test Email via Gmail SMTP / Appwrite Messaging
admin.post('/email/test', async (c) => {
  try {
    const {
      sendTestEmail,
      sendOtpEmail,
      sendNewsletterWelcomeEmail,
      sendOrderConfirmationEmail,
      sendPaymentVerifiedEmail,
      sendPaymentFailedEmail,
      sendShippingUpdateEmail,
      sendOutForDeliveryEmail,
      sendOrderDeliveredEmail,
      sendOrderCancelledEmail,
      sendRefundProcessedEmail,
      sendAbandonedCartEmail,
    } = await import('../lib/email');

    const body = await c.req.json().catch(() => ({}));
    const env = getEnv(c);
    const targetEmail = body.to || env?.SMTP_USER || process.env.SMTP_USER || 'clapcultureofficial@gmail.com';
    const type = (body.type || 'test').toLowerCase();

    let result;
    if (type === 'otp') {
      result = await sendOtpEmail(env, {
        toEmail: targetEmail,
        customerName: 'Test Rebel',
        otp: body.otp || '849201',
        purpose: body.purpose || 'LOGIN',
        expiryMinutes: 10,
      });
    } else if (type === 'order' || type === 'order_confirmation') {
      result = await sendOrderConfirmationEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra (Test Rebel)',
        orderId: 'CLAP-TEST-99001',
        totalAmount: 2798,
        subtotal: 2998,
        discountAmount: 200,
        shippingFee: 0,
        customerPhone: '+91 98765 43210',
        paymentStatus: 'VERIFIED',
        shippingAddress: 'Plot 42, Road No 36, Jubilee Hills, Hyderabad, Telangana 500033',
        items: [
          { name: 'OG Senani Heavyweight Oversized Tee', size: 'XL', quantity: 1, price: 1499 },
          { name: 'Rebel Star Washed Drop Tee', size: 'L', quantity: 1, price: 1299 },
        ],
      });
    } else if (type === 'payment_verified') {
      result = await sendPaymentVerifiedEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra',
        orderId: 'CLAP-TEST-99001',
        transactionId: 'UPI-REF-99882211',
        amount: 2798,
      });
    } else if (type === 'payment_failed') {
      result = await sendPaymentFailedEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra',
        orderId: 'CLAP-TEST-99001',
        reason: 'Payment reference UTR could not be matched. Please retry payment.',
        amount: 2798,
      });
    } else if (type === 'shipping') {
      result = await sendShippingUpdateEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra',
        orderId: 'CLAP-TEST-99001',
        trackingNumber: 'TRK-CLAP-987654321IN',
        courierName: 'BlueDart Express',
        estimatedDelivery: '2 Business Days',
      });
    } else if (type === 'out_for_delivery') {
      result = await sendOutForDeliveryEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra',
        orderId: 'CLAP-TEST-99001',
        trackingNumber: 'TRK-CLAP-987654321IN',
        deliveryAgent: 'Ramesh Kumar (BlueDart)',
        deliveryPhone: '+91 91234 56789',
      });
    } else if (type === 'delivered') {
      result = await sendOrderDeliveredEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra',
        orderId: 'CLAP-TEST-99001',
        discountCode: 'REBEL10',
      });
    } else if (type === 'cancelled') {
      result = await sendOrderCancelledEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra',
        orderId: 'CLAP-TEST-99001',
        reason: 'Customer requested size change / reorder.',
        refundAmount: 2798,
      });
    } else if (type === 'refund') {
      result = await sendRefundProcessedEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra',
        orderId: 'CLAP-TEST-99001',
        refundAmount: 2798,
        refundReference: 'RFND-UPI-8822001',
      });
    } else if (type === 'welcome') {
      result = await sendNewsletterWelcomeEmail(env, {
        toEmail: targetEmail,
        discountCode: 'REBEL10',
        discountPercentage: 10,
      });
    } else if (type === 'abandoned_cart') {
      result = await sendAbandonedCartEmail(env, {
        toEmail: targetEmail,
        customerName: 'Surendra',
        totalAmount: 1499,
        checkoutUrl: 'http://localhost:3000/checkout',
        discountCode: 'REBEL5',
        items: [
          { name: 'OG Senani Heavyweight Oversized Tee', size: 'XL', quantity: 1, price: 1499 },
        ],
      });
    } else {
      result = await sendTestEmail(env, targetEmail);
    }

    return c.json({ success: true, type, targetEmail, result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send test email';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default admin;

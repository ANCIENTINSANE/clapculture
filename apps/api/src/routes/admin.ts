import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import { getAppwriteClient } from '../lib/appwrite';
import { Query } from 'node-appwrite';
import { Env } from '@clapculture/shared';

const admin = new Hono<{ Bindings: Env }>();

admin.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    // Hardcoded for demo, normally would verify in database
    if (username === 'admin' && password === 'clapculture123') {
      const token = 'admin-secret-token-demo'; // would use real JWT
      return c.json({ success: true, data: { token } });
    }
    
    return c.json({ success: false, error: 'Invalid credentials' }, 401);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

admin.get('/dashboard', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    
    // Quick summary (ideally run via Appwrite functions for performance)
    const ordersRes = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      [Query.limit(100)] // Simplification for demo
    );
    
    const totalOrders = ordersRes.total;
    const totalSales = ordersRes.documents.reduce((acc, o) => acc + (o.total || 0), 0);
    const pendingPayments = ordersRes.documents.filter(o => o.paymentStatus === 'SUBMITTED').length;
    
    return c.json({ 
      success: true, 
      data: {
        totalOrders,
        totalSales,
        pendingPayments
      } 
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

admin.get('/me', adminAuth, async (c) => {
  const adminData = c.get('admin');
  return c.json({ success: true, data: adminData });
});

export default admin;

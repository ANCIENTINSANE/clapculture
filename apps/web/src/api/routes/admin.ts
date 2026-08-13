import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { signAdminToken } from '../lib/jwt';
import { Query } from 'node-appwrite';

const admin = new Hono();

admin.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    if (!username || !password) {
      return c.json({ success: false, error: 'Username and password required' }, 400);
    }

    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    let adminRecord: any = null;

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
    } catch (e) {
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
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
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
    const totalSales = ordersRes.documents.reduce((acc, o: any) => acc + (o.total || 0), 0);
    const pendingPayments = ordersRes.documents.filter((o: any) => o.paymentStatus === 'SUBMITTED').length;
    
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
  const adminData = (c.var as any).admin;
  return c.json({ success: true, data: adminData });
});

export default admin;

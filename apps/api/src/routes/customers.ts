import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { getAppwriteClient } from '../lib/appwrite';
import { adminAuth } from '../middleware/auth';
import { Env } from '@clapculture/shared';

const customers = new Hono<{ Bindings: Env }>();

customers.get('/', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    
    // In a real app, you would maintain a separate customers collection
    // and sync it when orders are created. For this implementation,
    // we fetch from orders or a dedicated customers table.
    
    const response = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'customers',
      [Query.orderDesc('totalSpent')]
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

customers.get('/:id', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(c.env);
    const id = c.req.param('id');
    
    const customerResp = await databases.getDocument(
      c.env.APPWRITE_DATABASE_ID,
      'customers',
      id
    );
    
    // Get their orders
    const ordersResp = await databases.listDocuments(
      c.env.APPWRITE_DATABASE_ID,
      'orders',
      [Query.equal('customer.email', customerResp.email)] // assuming nested match works or separate index
    );
    
    return c.json({ 
      success: true, 
      data: {
        ...customerResp,
        orders: ordersResp.documents
      } 
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default customers;

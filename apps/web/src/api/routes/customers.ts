import { Hono } from 'hono';
import { getAppwriteClient } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';
import { Query } from 'node-appwrite';

const customers = new Hono();

customers.get('/', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'customers',
      [Query.limit(50)]
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

customers.get('/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id') || '';
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const customer = await databases.getDocument(
      dbId,
      'customers',
      id
    );
    
    const orders = await databases.listDocuments(
      dbId,
      'orders',
      [Query.equal('customer.email', (customer as any).email || '')]
    );
    
    return c.json({ 
      success: true, 
      data: {
        ...customer,
        orderHistory: orders.documents
      } 
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default customers;

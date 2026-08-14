import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { getAppwriteClient, AppwriteEnv } from '../lib/appwrite';
import { getDbId, getEnv } from '../lib/utils';
import { adminAuth } from '../middleware/auth';

const customers = new Hono();

// Helper to upsert customer and Appwrite Auth user
export async function upsertCustomerAndUser(
  env: AppwriteEnv,
  customerData: {
    email: string;
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    orderId?: string;
    source?: string;
  }
) {
  if (!customerData.email) return null;
  const email = customerData.email.trim().toLowerCase();
  const fullName = (customerData.fullName || 'Valued Rebel').trim();
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || 'Valued';
  const lastName = nameParts.slice(1).join(' ') || 'Rebel';
  const phone = customerData.phone || '';

  const { databases, users } = getAppwriteClient(env);
  const dbId = env.APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || 'clapculture_db';

  // 1. Upsert into Appwrite Auth Users (for marketing and app auth)
  try {
    const existingUsers = await users.list([Query.equal('email', email)]);
    if (existingUsers.total === 0) {
      await users.create(
        ID.unique(),
        email,
        phone.replace(/[^\d+]/g, '') || undefined,
        undefined, // random / no password required for guest/lead
        fullName
      );
    } else {
      const user = existingUsers.users[0];
      if (fullName && (!user.name || user.name === 'Valued Rebel')) {
        await users.updateName(user.$id, fullName);
      }
      if (phone && !user.phone) {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        if (cleanPhone.startsWith('+')) {
          await users.updatePhone(user.$id, cleanPhone).catch(() => {});
        }
      }
    }
  } catch (e) {
    console.log('Appwrite Auth user sync notice:', (e as Error).message);
  }

  // 2. Upsert into Appwrite 'customers' Database Collection
  try {
    const existingDocs = await databases.listDocuments(dbId, 'customers', [
      Query.equal('email', email),
      Query.limit(1),
    ]);

    if (existingDocs.documents.length > 0) {
      const doc = existingDocs.documents[0];
      let ordersList: string[] = [];
      try {
        ordersList = typeof doc.orders === 'string' ? JSON.parse(doc.orders) : Array.isArray(doc.orders) ? doc.orders : [];
      } catch {
        ordersList = [];
      }
      if (customerData.orderId && !ordersList.includes(customerData.orderId)) {
        ordersList.push(customerData.orderId);
      }

      const updated = await databases.updateDocument(dbId, 'customers', doc.$id, {
        firstName: firstName || doc.firstName,
        lastName: lastName || doc.lastName,
        phone: phone || doc.phone,
        orders: JSON.stringify(ordersList),
      });
      return updated;
    } else {
      const ordersList = customerData.orderId ? [customerData.orderId] : [];
      const created = await databases.createDocument(dbId, 'customers', ID.unique(), {
        email,
        firstName,
        lastName,
        phone: phone || '',
        orders: JSON.stringify(ordersList),
      });
      return created;
    }
  } catch (e) {
    console.log('Customer DB sync notice:', (e as Error).message);
    return null;
  }
}

// GET /api/customers - List customers (Admin)
customers.get('/', adminAuth, async (c) => {
  try {
    const { databases } = getAppwriteClient(getEnv(c));
    const dbId = getDbId(c);
    
    const response = await databases.listDocuments(
      dbId,
      'customers',
      [Query.limit(100)]
    );
    
    return c.json({ success: true, data: response.documents });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

// POST /api/customers - Save or update customer details (Public / Storefront / Favorites / Checkout)
customers.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const env = getEnv(c);

    if (!body.email) {
      return c.json({ success: false, error: 'Email is required' }, 400);
    }

    const result = await upsertCustomerAndUser(env, body);
    return c.json({ success: true, data: result }, 201);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

// GET /api/customers/:id - Customer details + order history (Admin)
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
      [Query.equal('customer.email', (customer as Record<string, unknown>).email as string || '')]
    );
    
    return c.json({ 
      success: true, 
      data: {
        ...customer,
        orderHistory: orders.documents
      } 
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default customers;

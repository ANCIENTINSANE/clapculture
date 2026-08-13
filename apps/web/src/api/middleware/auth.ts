import { Context, Next } from 'hono';
import { verifyAdminToken } from '../lib/jwt';

export const adminAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized: Admin session token required' }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  const payload = verifyAdminToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'Unauthorized: Session invalid or expired' }, 401);
  }
  
  // Attach validated admin payload to context
  c.set('admin' as any, payload);
  
  await next();
};

import { Context, Next } from 'hono';

// Note: In a production Cloudflare Worker environment, you'd use a lightweight
// JWT library compatible with standard crypto APIs, such as @tsndr/cloudflare-worker-jwt
// For simplicity in this example, we implement a basic auth check.

export const adminAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized: No token provided' }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  
  // A real implementation would verify the JWT here.
  // Example pseudo-code:
  // const isValid = await jwt.verify(token, c.env.JWT_SECRET);
  // if (!isValid) return c.json({ success: false, error: 'Invalid token' }, 401);
  
  if (token !== 'admin-secret-token-demo') {
    // return c.json({ success: false, error: 'Unauthorized: Invalid token' }, 401);
  }
  
  // Attach user to context
  c.set('admin', { id: 'admin-1', role: 'admin' });
  
  await next();
};

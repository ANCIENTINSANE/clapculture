// Polyfill process.versions.node for Cloudflare Workers compatibility with undici/node-appwrite
if (typeof process !== 'undefined') {
  process.versions = process.versions || {};
  if (!process.versions.node) {
    (process.versions as any).node = '20.0.0';
  }
}

import { Hono } from 'hono';
import { Env } from './types';
import { configureCors } from './middleware/cors';

import products from './routes/products';
import categories from './routes/categories';
import collections from './routes/collections';
import orders from './routes/orders';
import payments from './routes/payments';
import media from './routes/media';
import admin from './routes/admin';
import search from './routes/search';
import homepage from './routes/homepage';
import customers from './routes/customers';
import discounts from './routes/discounts';
import settings from './routes/settings';

const app = new Hono<{ Bindings: Env }>();

// Apply CORS middleware
app.use('*', (c, next) => configureCors(c.env)(c, next));

// Global error handler
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ success: false, error: err.message || 'Internal Server Error' }, 500);
});

// Root endpoint for health check
app.get('/', (c) => {
  return c.json({ 
    success: true, 
    message: 'Welcome to CLAPCULTURE API v1',
    status: 'Operational'
  });
});

// Mount routes
app.route('/api/products', products);
app.route('/api/categories', categories);
app.route('/api/collections', collections);
app.route('/api/orders', orders);
app.route('/api/payments', payments);
app.route('/api/media', media);
app.route('/api/admin', admin);
app.route('/api/search', search);
app.route('/api/homepage', homepage);
app.route('/api/customers', customers);
app.route('/api/discounts', discounts);
app.route('/api/settings', settings);

export default app;

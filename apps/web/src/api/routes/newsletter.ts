import { Hono } from 'hono';
import { getEnv } from '../lib/utils';
import { sendNewsletterWelcomeEmail } from '../lib/email';
import { upsertCustomerAndUser } from './customers';

const newsletter = new Hono();

newsletter.post('/', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email || !email.includes('@') || !email.includes('.')) {
      return c.json({ success: false, error: 'Please provide a valid email address.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const env = getEnv(c);

    // Save lead/customer to Appwrite
    upsertCustomerAndUser(env, {
      email: cleanEmail,
      source: 'newsletter_subscription',
    }).catch((e) => console.log('Newsletter lead capture notice:', e.message));

    // Send Welcome Email with Discount Code via Gmail SMTP
    const mailResult = await sendNewsletterWelcomeEmail(env, {
      toEmail: cleanEmail,
      discountCode: 'REBEL10',
      discountPercentage: 10,
    });

    return c.json({
      success: true,
      message: 'Welcome to CLAPCULTURE! An exclusive 10% discount code has been sent to your inbox.',
      discountCode: 'REBEL10',
      mailResult,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    console.error('Newsletter subscription error:', error);
    return c.json({ success: false, error: msg || 'Failed to subscribe' }, 500);
  }
});

export default newsletter;

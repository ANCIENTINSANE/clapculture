import { Hono } from 'hono';
import { getEnv } from '../lib/utils';
import { sendContactInquiryEmail } from '../lib/email';

const contact = new Hono();

contact.post('/', async (c) => {
  try {
    const { name, email, subject, message, phone } = await c.req.json();

    if (!name || !email || !subject || !message) {
      return c.json(
        { success: false, error: 'Please provide all required fields (name, email, subject, message).' },
        400
      );
    }

    if (!email.includes('@') || !email.includes('.')) {
      return c.json({ success: false, error: 'Please provide a valid email address.' }, 400);
    }

    const env = getEnv(c);

    // Send customer auto-reply + admin alert notification via Gmail SMTP
    const results = await sendContactInquiryEmail(env, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      phone: phone ? phone.trim() : undefined,
    });

    return c.json({
      success: true,
      message: 'Transmission received! Our support team will get back to you within 24 hours.',
      results,
    });
  } catch (error: unknown) {
    console.error('Contact inquiry error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to send message';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default contact;

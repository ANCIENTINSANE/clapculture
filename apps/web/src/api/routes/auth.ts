import { Hono } from 'hono';
import { getEnv } from '../lib/utils';
import { generateOtp, storeOtp, verifyOtp, OtpPurpose } from '../lib/otp';
import { sendOtpEmail, sendPasswordResetEmail } from '../lib/email';

const auth = new Hono();

// Send OTP to Email
auth.post('/otp/send', async (c) => {
  try {
    const { email, purpose = 'LOGIN', customerName } = await c.req.json();

    if (!email || !email.includes('@') || !email.includes('.')) {
      return c.json({ success: false, error: 'Please provide a valid email address.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPurpose = (purpose.toUpperCase() as OtpPurpose) || 'LOGIN';
    const otp = generateOtp();
    const expiryMinutes = 10;

    // Store in secure memory store
    storeOtp(cleanEmail, cleanPurpose, otp, expiryMinutes);

    const env = getEnv(c);

    // Send OTP via Gmail SMTP / Appwrite Messaging
    const mailResult = await sendOtpEmail(env, {
      toEmail: cleanEmail,
      customerName,
      otp,
      purpose: cleanPurpose,
      expiryMinutes,
    });

    return c.json({
      success: true,
      message: `A 6-digit OTP code has been dispatched to ${cleanEmail}. Valid for ${expiryMinutes} minutes.`,
      expiryMinutes,
      mailResult,
    });
  } catch (error: unknown) {
    console.error('OTP Send Error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to send OTP code';
    return c.json({ success: false, error: msg }, 500);
  }
});

// Verify Entered OTP
auth.post('/otp/verify', async (c) => {
  try {
    const { email, purpose = 'LOGIN', otp } = await c.req.json();

    if (!email || !otp) {
      return c.json({ success: false, error: 'Email and OTP are required.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPurpose = (purpose.toUpperCase() as OtpPurpose) || 'LOGIN';
    const result = verifyOtp(cleanEmail, cleanPurpose, String(otp));

    if (!result.valid) {
      return c.json({ success: false, error: result.reason || 'Invalid OTP code' }, 400);
    }

    return c.json({
      success: true,
      verified: true,
      message: 'OTP verified successfully.',
      email: cleanEmail,
      purpose: cleanPurpose,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('OTP Verify Error:', error);
    const msg = error instanceof Error ? error.message : 'Verification failed';
    return c.json({ success: false, error: msg }, 500);
  }
});

// Request Password Reset
auth.post('/password-reset', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: 'Valid email is required.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const resetCode = generateOtp();
    const env = getEnv(c);

    storeOtp(cleanEmail, 'PASSWORD_RESET', resetCode, 15);

    await sendPasswordResetEmail(env, {
      toEmail: cleanEmail,
      resetCode,
    });

    return c.json({
      success: true,
      message: 'Password reset instructions and security code have been sent to your email.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to initiate password reset';
    return c.json({ success: false, error: msg }, 500);
  }
});

export default auth;

import crypto from 'crypto';

export type OtpPurpose = 'LOGIN' | 'CHECKOUT' | 'ORDER_TRACKING' | 'ADMIN_2FA' | 'PASSWORD_RESET' | 'VERIFICATION';

export interface OtpRecord {
  code: string;
  purpose: OtpPurpose;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

// In-Memory Secure OTP Store (keyed by `email:purpose`)
const otpStore = new Map<string, OtpRecord>();

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Store an OTP with an expiration time (default: 10 minutes)
 */
export function storeOtp(
  email: string,
  purpose: OtpPurpose,
  code: string,
  expiryMinutes = 10
): OtpRecord {
  const key = `${email.toLowerCase().trim()}:${purpose}`;
  const record: OtpRecord = {
    code,
    purpose,
    expiresAt: Date.now() + expiryMinutes * 60 * 1000,
    attempts: 0,
    createdAt: Date.now(),
  };

  otpStore.set(key, record);
  return record;
}

/**
 * Verify an entered OTP against the store
 */
export function verifyOtp(
  email: string,
  purpose: OtpPurpose,
  enteredCode: string
): { valid: boolean; reason?: string } {
  const key = `${email.toLowerCase().trim()}:${purpose}`;
  const record = otpStore.get(key);

  if (!record) {
    return { valid: false, reason: 'No active OTP found. Please request a new OTP.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return { valid: false, reason: 'OTP has expired. Please request a new OTP.' };
  }

  if (record.attempts >= 5) {
    otpStore.delete(key);
    return { valid: false, reason: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  record.attempts += 1;

  if (record.code !== enteredCode.trim()) {
    return {
      valid: false,
      reason: `Incorrect OTP. ${5 - record.attempts} attempts remaining.`,
    };
  }

  // OTP is valid - consume it immediately
  otpStore.delete(key);
  return { valid: true };
}

/**
 * Clear expired OTP records to prevent memory leak
 */
export function cleanupExpiredOtps(): void {
  const now = Date.now();
  for (const [key, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(key);
    }
  }
}

interface AdminPayload {
  id: string;
  username: string;
  role: string;
  exp: number;
}

const getSecret = (): string => {
  return process.env.JWT_SECRET || 'super_secret_jwt_key_clapculture_2026';
};

function hmacSha256(secret: string, data: string): string {
  try {
    const req = eval('require');
    const nodeCrypto = req('crypto');
    return nodeCrypto.createHmac('sha256', secret).update(data).digest('base64url');
  } catch (e) {
    let hash = 0;
    const combined = secret + ':' + data;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Buffer.from(hash.toString(16)).toString('base64url');
  }
}

/**
 * Sign an admin JWT session token valid for 24 hours.
 */
export function signAdminToken(payload: { id: string; username: string; role: string }): string {
  const secret = getSecret();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  
  const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 Hours
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');

  const signature = hmacSha256(secret, `${header}.${body}`);

  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode an admin JWT session token.
 */
export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const secret = getSecret();

    const expectedSignature = hmacSha256(secret, `${header}.${body}`);

    if (signature !== expectedSignature) return null;

    const decodedPayload: AdminPayload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    
    // Check token expiration
    if (decodedPayload.exp && Math.floor(Date.now() / 1000) > decodedPayload.exp) {
      return null;
    }

    return decodedPayload;
  } catch (e) {
    return null;
  }
}

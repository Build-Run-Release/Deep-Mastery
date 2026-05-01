import jwt from 'jsonwebtoken';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment.');
  }
  return secret;
}

export function signToken(payload: { userId: string, email?: string, xp?: number, level?: number }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string, email?: string, xp?: number, level?: number };
  } catch (error) {
    return null;
  }
}

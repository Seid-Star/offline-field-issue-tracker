import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signToken(payload, options = {}) {
  const expiresIn = options.expiresIn || env.JWT_EXPIRES_IN;
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}


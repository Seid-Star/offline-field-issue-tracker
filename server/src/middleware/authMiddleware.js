import { User } from '../models/User.js';
import { verifyToken } from '../utils/token.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token is missing or malformed.',
      },
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Authentication token is invalid or has expired.',
      },
    });
  }

  const user = await User.findById(decoded.userId).select('-passwordHash');
  if (!user) {
    return res.status(401).json({
      error: {
        code: 'USER_NOT_FOUND',
        message: 'The user account associated with this token no longer exists.',
      },
    });
  }

  req.user = user;
  next();
}

export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded && decoded.userId) {
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (user) {
        req.user = user;
      }
    }
  }
  next();
}


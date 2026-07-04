import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../services/firebase.service.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await verifyIdToken(token);
    req.userId = decoded.uid;
    req.userEmail = decoded.email;
    next();
  } catch {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired authentication token' } });
  }
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  verifyIdToken(token)
    .then((decoded) => {
      req.userId = decoded.uid;
      req.userEmail = decoded.email;
      next();
    })
    .catch(() => {
      next();
    });
}

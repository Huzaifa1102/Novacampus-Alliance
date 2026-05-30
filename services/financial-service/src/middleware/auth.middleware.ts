import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to carry our user claims
declare global {
  namespace Express {
    interface Request {
      user?: {
        id:        string;
        role:      string;
        campusId:  string;
        programId?: string;
      };
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      status: 'failure',
      data: null,
      error: 'No token provided',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode the JWT payload without verifying signature
    // (Kong already verified the signature before forwarding)
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(
      Buffer.from(base64Payload, 'base64').toString('utf8')
    );

    // Check expiry
    if (payload.exp * 1000 < Date.now()) {
      res.status(401).json({
        status: 'failure',
        data: null,
        error: 'Token expired',
        timestamp: new Date().toISOString()
      });
      return;
    }

    req.user = {
      id:        payload.sub,
      role:      payload.role,
      campusId:  payload.campus_id,
      programId: payload.program_id
    };

    next();
  } catch {
    res.status(401).json({
      status: 'failure',
      data: null,
      error: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }
}

// Role-based authorization — use after authMiddleware
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'failure',
        data: null,
        error: `Access denied. Required role: ${roles.join(' or ')}`,
        timestamp: new Date().toISOString()
      });
      return;
    }
    next();
  };
}
import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  res.status(500).json({
    status: 'failure',
    data: null,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
}
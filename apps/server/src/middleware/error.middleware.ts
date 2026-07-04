import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled error:', err.message);

  if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'AI rate limit reached on free tier. Please wait 30 seconds and try again.',
      },
    });
    return;
  }

  if (err.message.includes('API_KEY') || err.message.includes('API key')) {
    res.status(503).json({
      success: false,
      error: {
        code: 'AI_SERVICE_ERROR',
        message: 'AI service temporarily unavailable. Please try again.',
      },
    });
    return;
  }

  if (err.message.includes('parse') || err.message.includes('JSON')) {
    res.status(502).json({
      success: false,
      error: {
        code: 'AI_PARSE_ERROR',
        message: 'Failed to process AI response. Please try again.',
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    },
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found.',
    },
  });
}

import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle SyntaxError (invalid JSON payload)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload received.',
      },
    });
  }

  // Handle Mongoose duplicate key error (e.g. unique clientId or email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    return res.status(409).json({
      error: {
        code: field === 'clientId' ? 'DUPLICATE_CLIENT_ID' : 'DUPLICATE_RESOURCE',
        message: `A record with this ${field} ("${value}") already exists.`,
        details: { field, value },
      },
    });
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = {};
    for (const [key, val] of Object.entries(err.errors)) {
      details[key] = val.message;
    }
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed for one or more fields.',
        details,
      },
    });
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: {
        code: 'INVALID_ID',
        message: `Invalid format for field "${err.path}".`,
      },
    });
  }

  // Custom status code if provided
  const status = err.statusCode || err.status || 500;
  const code = err.code || (status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR');
  const message = err.message || 'An unexpected internal error occurred.';

  // Build response
  const response = {
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  };

  if (env.NODE_ENV === 'development' && status >= 500) {
    response.error.stack = err.stack;
  }

  return res.status(status).json(response);
}


import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { reportRoutes } from './routes/reportRoutes.js';
import { syncRoutes } from './routes/syncRoutes.js';

export function createApp() {
  const app = express();

  // Basic security headers & parsing
  app.disable('x-powered-by');

  // CORS Configuration
  const allowedOrigins = [
    env.CLIENT_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in dev, or can restrict if needed
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Rate Limiting (disabled in test environment)
  if (env.NODE_ENV !== 'test') {
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many authentication attempts. Please try again after 15 minutes.',
        },
      },
    });

    const syncLimiter = rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many synchronization requests. Please slow down batch retries.',
        },
      },
    });

    app.use('/api/auth', authLimiter);
    app.use('/api/reports/sync', syncLimiter);
    app.use('/api/sync', syncLimiter);
  }

  // Health check routes
  app.use('/api/health', healthRoutes);
  app.use('/health', healthRoutes);

  // Authentication routes
  app.use('/api/auth', authRoutes);

  // Synchronization routes (must be registered before /api/reports/:id to prevent route clash)
  app.use('/api/reports/sync', syncRoutes);
  app.use('/api/sync', syncRoutes);

  // Reports CRUD & Workflow routes
  app.use('/api/reports', reportRoutes);

  // Dashboard routes
  app.use('/api/dashboard', dashboardRoutes);

  // Fallback 404 for unrecognized API endpoints
  app.use('/api/*', (req, res) => {
    return res.status(404).json({
      error: {
        code: 'ENDPOINT_NOT_FOUND',
        message: `Endpoint ${req.method} ${req.baseUrl || req.originalUrl} does not exist.`,
      },
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();


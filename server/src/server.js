import { app } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';
import { seedInitialCoordinator } from './services/authService.js';

async function bootstrap() {
  try {
    console.log(`[BOOT] Connecting to MongoDB at ${env.MONGODB_URI}...`);
    await connectDB();
    console.log(`[BOOT] MongoDB connected successfully.`);

    // Auto-seed coordinator if credentials configured in environment
    if (env.COORDINATOR_SEED_EMAIL && env.COORDINATOR_SEED_PASSWORD) {
      const result = await seedInitialCoordinator({
        email: env.COORDINATOR_SEED_EMAIL,
        password: env.COORDINATOR_SEED_PASSWORD,
        name: env.COORDINATOR_SEED_NAME || 'Elena Vance',
      });
      if (result.created) {
        console.log(`[BOOT] Initial coordinator provisioned: ${env.COORDINATOR_SEED_EMAIL}`);
      }
    }

    const server = app.listen(env.PORT, () => {
      console.log(`[BOOT] Offline Field Issue Tracker API running on port ${env.PORT} (${env.NODE_ENV})`);
      console.log(`[BOOT] Health probe: http://localhost:${env.PORT}/api/health`);
    });

    const shutdown = async (signal) => {
      console.log(`\n[SHUTDOWN] Received ${signal}. Closing HTTP server...`);
      server.close(async () => {
        console.log('[SHUTDOWN] HTTP server closed.');
        await disconnectDB();
        console.log('[SHUTDOWN] MongoDB connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();


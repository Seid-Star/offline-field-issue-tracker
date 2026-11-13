import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { seedInitialCoordinator } from '../services/authService.js';

async function runSeed() {
  const email = process.argv[2] || env.COORDINATOR_SEED_EMAIL || 'coordinator@fieldops.org';
  const password = process.argv[3] || env.COORDINATOR_SEED_PASSWORD || 'CoordinatorPass123!';
  const name = process.argv[4] || env.COORDINATOR_SEED_NAME || 'Elena Vance';

  console.log(`[SEED] Connecting to MongoDB...`);
  await connectDB();

  try {
    const result = await seedInitialCoordinator({ email, password, name });
    if (result.created) {
      console.log(`[SEED] SUCCESS: Created Coordinator account: ${email}`);
    } else {
      console.log(`[SEED] NOTICE: Coordinator account "${email}" already exists.`);
    }
  } catch (err) {
    console.error(`[SEED] ERROR:`, err);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

runSeed();


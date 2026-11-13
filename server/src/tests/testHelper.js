import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectDB, disconnectDB, ensureCollectionsCreated } from '../config/db.js';

let replSet = null;
let standaloneServer = null;

export async function setupTestDB() {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_for_vitest_runner_only_32_chars!';

  try {
    replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' },
    });
    const uri = replSet.getUri();
    await connectDB(uri);
    await ensureCollectionsCreated();
  } catch (err) {
    console.warn('[TEST_SETUP] ReplSet failed, falling back to standalone MongoMemoryServer:', err.message);
    standaloneServer = await MongoMemoryServer.create();
    const uri = standaloneServer.getUri();
    await connectDB(uri);
    await ensureCollectionsCreated();
  }
}

export async function teardownTestDB() {
  await disconnectDB();
  if (replSet) {
    await replSet.stop();
    replSet = null;
  }
  if (standaloneServer) {
    await standaloneServer.stop();
    standaloneServer = null;
  }
}

export async function clearTestDB() {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
    await ensureCollectionsCreated();
  }
}

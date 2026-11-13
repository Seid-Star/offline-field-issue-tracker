import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function ensureCollectionsCreated() {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const existing = await mongoose.connection.db.listCollections().toArray();
    const names = existing.map((c) => c.name);
    if (!names.includes('users')) {
      await mongoose.connection.db.createCollection('users');
    }
    if (!names.includes('reports')) {
      await mongoose.connection.db.createCollection('reports');
    }
    if (!names.includes('activities')) {
      await mongoose.connection.db.createCollection('activities');
    }
  }
}

export async function connectDB(uri = env.MONGODB_URI) {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    isConnected = true;
    await ensureCollectionsCreated();
    return conn.connection;
  } catch (err) {
    isConnected = false;
    throw err;
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  isConnected = false;
}

export function getDBHealth() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  return {
    status: readyState === 1 ? 'connected' : 'disconnected',
    state: states[readyState] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}

/**
 * Executes work using Mongoose's built-in session.withTransaction,
 * which automatically retries transient transaction conflicts.
 */
export async function withTransaction(work) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

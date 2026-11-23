import mongoose from 'mongoose';
import { env } from './env.js';

export const isDBConnected = () => mongoose.connection.readyState === 1;

export const connectDB = async (uri = env.MONGO_URI) => {
  if (isDBConnected()) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected');
  });

  const conn = await mongoose.connect(uri);
  console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn.connection;
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

import mongoose from 'mongoose';
import AppConfig from './config';

const MONGO_URI = AppConfig.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGO_URI, opts).catch((error) => {
      console.error('Failed to connect to MongoDB:', error.message);
      // Reset the promise so we can retry
      cached.promise = null;
      throw new Error(`Database connection failed: ${error.message}`);
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('Connected to MongoDB successfully');
  } catch (e) {
    console.error('MongoDB connection error:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};
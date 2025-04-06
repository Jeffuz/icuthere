import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Use the MongoDB Atlas connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('Warning: MONGODB_URI environment variable is not set! Please set it in your .env.local file');
}

// Print effective connection URI (with password masked for security)
if (MONGODB_URI) {
  const maskedURI = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
  console.log('Using MongoDB Connection URI:', maskedURI);
}

// Global variable to cache the connection
let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  // Set strictQuery to prepare for future Mongoose 7 defaults
  mongoose.set('strictQuery', false);
  
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    
    console.log('MongoDB connected successfully');
    
    // Cache the database connection
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
import { connectToDatabase } from './mongodb';

/**
 * Global middleware for database operations
 * Use this function to wrap your API handlers
 */
export async function dbConnect() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw new Error('Database connection failed');
  }
}
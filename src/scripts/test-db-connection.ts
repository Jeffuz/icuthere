// Load environment variables from .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { connectToDatabase } from '../lib/mongodb';
import { User } from '../lib/models/user';

// Print the MongoDB URI being used (with password masked)
const mongoUri = process.env.MONGODB_URI || 'Not set';
console.log('Using MongoDB URI:', mongoUri.replace(/:([^@]+)@/, ':****@'));

async function testConnection() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB Atlas...');
    await connectToDatabase();
    console.log('Connected successfully to MongoDB Atlas!');
    
    // Test simple operation - count users
    const userCount = await User.countDocuments();
    console.log(`Database has ${userCount} users`);
    
    console.log('Connection test completed successfully!');
  } catch (error) {
    console.error('Connection test failed:', error);
  } finally {
    process.exit(0);
  }
}

testConnection();
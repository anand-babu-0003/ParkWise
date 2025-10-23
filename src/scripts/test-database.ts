/**
 * Test script to verify database connectivity
 */

import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

async function testDatabase() {
  console.log('Testing Database Connectivity...\n');
  
  try {
    // Test database connection
    console.log('Connecting to database...');
    const connection = await connectToDatabase();
    console.log('✓ Database connected successfully');
    console.log('- Connection ready state:', connection.connection.readyState);
    console.log('');
    
    // Test simple query
    console.log('Testing simple query...');
    const userCount = await User.countDocuments();
    console.log('✓ Query executed successfully');
    console.log('- Total users in database:', userCount);
    console.log('');
    
    console.log('Database tests completed successfully!');
    
  } catch (error) {
    console.error('Error testing database:', error);
  }
}

testDatabase();
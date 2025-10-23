/**
 * Test script to verify setup status API
 */

import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

async function testSetupAPI() {
  console.log('Testing Setup Status API directly...\n');
  
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('✓ Database connected');
    
    console.log('Checking for admin user...');
    const adminUser = await User.findOne({ role: 'admin' });
    console.log('✓ Query executed');
    console.log('- Admin user found:', !!adminUser);
    
    if (adminUser) {
      console.log('- Admin user details:');
      console.log('  ID:', adminUser._id.toString());
      console.log('  Name:', adminUser.name);
      console.log('  Email:', adminUser.email);
    }
    
    console.log('\nSetup status result:');
    console.log('{ isSetupComplete: ' + !!adminUser + ' }');
    
  } catch (error) {
    console.error('Error testing setup API:', error);
  }
}

testSetupAPI();
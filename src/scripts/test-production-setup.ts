import { connectToDatabase } from '../lib/db';
import User from '../models/User';

async function testProductionSetup() {
  console.log('Testing production setup...');
  
  try {
    // Test database connection
    console.log('Connecting to database...');
    const connection = await connectToDatabase();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    console.log('Checking for admin user...');
    const adminUser = await User.findOne({ role: 'admin' });
    console.log(`Admin user exists: ${!!adminUser}`);
    
    if (adminUser) {
      console.log(`Admin email: ${adminUser.email}`);
    }
    
    console.log('✅ Production setup test completed successfully');
  } catch (error: any) {
    console.error('❌ Production setup test failed:', error.message);
    
    // Provide specific troubleshooting steps
    if (error.message.includes('MongoServerSelectionError') || 
        error.message.includes('Could not connect to any servers')) {
      console.error('\n🔧 Troubleshooting steps:');
      console.error('1. Check if your MongoDB Atlas cluster is running');
      console.error('2. Verify your IP address is whitelisted in MongoDB Atlas Network Access');
      console.error('3. Check your MongoDB credentials in the connection string');
      console.error('4. Ensure you have internet connectivity');
      console.error('5. For Vercel deployment, make sure MONGO_URI is set in environment variables');
    }
  }
}

testProductionSetup();
import mongoose from 'mongoose';
import AppConfig from '../lib/config';

async function testDatabaseConnection() {
  console.log('Testing MongoDB connection...');
  console.log('Using URI:', AppConfig.MONGO_URI?.substring(0, 50) + '...'); // Show first 50 chars for security

  try {
    await mongoose.connect(AppConfig.MONGO_URI!, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Successfully connected to MongoDB');
    
    // Try a simple operation
    const collections = await mongoose.connection.db?.listCollections().toArray();
    if (collections) {
      console.log('Available collections:', collections.map(c => c.name));
    }
    
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('MongoServerSelectionError')) {
      console.error('\n🔧 Troubleshooting steps:');
      console.error('1. Check if your MongoDB Atlas cluster is running');
      console.error('2. Verify your IP address is whitelisted in MongoDB Atlas Network Access');
      console.error('3. Check your MongoDB credentials in the connection string');
      console.error('4. Ensure you have internet connectivity');
    }
    
    process.exit(1);
  }
}

testDatabaseConnection();
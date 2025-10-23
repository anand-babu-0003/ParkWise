import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

async function testUsers() {
  try {
    await connectToDatabase();
    console.log('Connected to database');
    
    // List all users
    const users = await User.find({}, 'name email role');
    console.log('Users in database:');
    console.log(users);
    
    // Try to find a specific user
    const testUser = await User.findOne({ email: 'test@example.com' });
    console.log('Test user:', testUser);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUsers();
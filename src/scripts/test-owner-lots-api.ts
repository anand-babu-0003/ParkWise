import { connectToDatabase } from '../lib/db';
import ParkingLot from '../models/ParkingLot';
import ParkingLotOwner from '../models/ParkingLotOwner';
import User from '../models/User';

async function testOwnerLotsAPI() {
  console.log('Testing Owner Lots API with new data format...');
  
  try {
    // Connect to database
    await connectToDatabase();
    console.log('✅ Database connected');
    
    // Create a test user (owner)
    const timestamp = Date.now();
    console.log('Creating test owner user...');
    const testUser = new User({
      name: 'Test Owner API',
      email: `testownerapi${timestamp}@example.com`,
      password: 'password123',
      role: 'owner'
    });
    
    const savedUser = await testUser.save();
    console.log('✅ Test user created:', savedUser._id.toString());
    
    // Create a test owner profile
    console.log('Creating test owner profile...');
    const testOwner = new ParkingLotOwner({
      userId: savedUser._id.toString(),
      businessName: 'Test Parking Business API',
      contactInfo: {
        phone: '123-456-7890',
        address: '123 Test Street, Test City'
      }
    });
    
    const savedOwner = await testOwner.save();
    console.log('✅ Test owner profile created:', savedOwner._id.toString());
    
    // Test creating a parking lot with the new format (locationCoords already provided)
    console.log('Creating test parking lot with new format...');
    const testLotData = {
      name: 'Test Parking Lot API',
      location: '456 Test Avenue, Test City',
      locationCoords: {
        type: 'Point' as const,
        coordinates: [-73.9857, 40.7484] // [longitude, latitude]
      },
      availableSlots: 10,
      totalSlots: 20,
      pricePerHour: 5.50,
      imageId: 'test-image-api-123',
      operatingHours: '24/7',
      ownerId: savedOwner._id.toString()
    };
    
    const testLot = new ParkingLot(testLotData);
    const savedLot = await testLot.save();
    console.log('✅ Test parking lot created with new format:', savedLot._id.toString());
    
    // Add lot to owner's lots array
    savedOwner.lots.push(savedLot._id.toString());
    await savedOwner.save();
    console.log('✅ Parking lot added to owner profile');
    
    // Test fetching the parking lot
    console.log('Fetching test parking lot...');
    const fetchedLot = await ParkingLot.findById(savedLot._id);
    console.log('✅ Test parking lot fetched:', fetchedLot?.name);
    console.log('✅ Location coords:', fetchedLot?.locationCoords);
    
    // Test deleting the parking lot
    console.log('Deleting test parking lot...');
    await ParkingLot.findByIdAndDelete(savedLot._id);
    console.log('✅ Test parking lot deleted');
    
    // Clean up: Remove lot from owner's lots array
    savedOwner.lots = savedOwner.lots.filter((lotId: any) => lotId.toString() !== savedLot._id.toString());
    await savedOwner.save();
    console.log('✅ Parking lot removed from owner profile');
    
    // Clean up: Delete test owner profile
    await ParkingLotOwner.findByIdAndDelete(savedOwner._id);
    console.log('✅ Test owner profile deleted');
    
    // Clean up: Delete test user
    await User.findByIdAndDelete(savedUser._id);
    console.log('✅ Test user deleted');
    
    console.log('\n🎉 All owner lots API tests completed successfully!');
  } catch (error: any) {
    console.error('❌ Error during owner lots API tests:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testOwnerLotsAPI();
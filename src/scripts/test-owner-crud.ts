import { connectToDatabase } from '../lib/db';
import ParkingLot from '../models/ParkingLot';
import ParkingLotOwner from '../models/ParkingLotOwner';
import User from '../models/User';

async function testOwnerCRUD() {
  console.log('Testing Owner CRUD Operations...');
  
  try {
    // Connect to database
    await connectToDatabase();
    console.log('✅ Database connected');
    
    // Create a test user (owner) with unique email
    const timestamp = Date.now();
    console.log('Creating test owner user...');
    const testUser = new User({
      name: 'Test Owner',
      email: `testowner${timestamp}@example.com`,
      password: 'password123',
      role: 'owner'
    });
    
    const savedUser = await testUser.save();
    console.log('✅ Test user created:', savedUser._id.toString());
    
    // Create a test owner profile
    console.log('Creating test owner profile...');
    const testOwner = new ParkingLotOwner({
      userId: savedUser._id.toString(),
      businessName: 'Test Parking Business',
      contactInfo: {
        phone: '123-456-7890',
        address: '123 Test Street, Test City'
      }
    });
    
    const savedOwner = await testOwner.save();
    console.log('✅ Test owner profile created:', savedOwner._id.toString());
    
    // Test creating a parking lot with proper geospatial data
    console.log('Creating test parking lot...');
    const testLot = new ParkingLot({
      name: 'Test Parking Lot',
      location: '456 Test Avenue, Test City',
      locationCoords: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484] // [longitude, latitude] - New York coordinates as example
      },
      availableSlots: 10,
      totalSlots: 20,
      pricePerHour: 5.50,
      imageId: 'test-image-123',
      operatingHours: '24/7',
      ownerId: savedOwner._id.toString()
    });
    
    const savedLot = await testLot.save();
    console.log('✅ Test parking lot created:', savedLot._id.toString());
    
    // Add lot to owner's lots array
    savedOwner.lots.push(savedLot._id.toString());
    await savedOwner.save();
    console.log('✅ Parking lot added to owner profile');
    
    // Test updating the parking lot
    console.log('Updating test parking lot...');
    savedLot.availableSlots = 15;
    savedLot.pricePerHour = 6.00;
    const updatedLot = await savedLot.save();
    console.log('✅ Test parking lot updated:', updatedLot.availableSlots, updatedLot.pricePerHour);
    
    // Test fetching the parking lot
    console.log('Fetching test parking lot...');
    const fetchedLot = await ParkingLot.findById(savedLot._id);
    console.log('✅ Test parking lot fetched:', fetchedLot?.name, fetchedLot?.availableSlots);
    
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
    
    console.log('\n🎉 All owner CRUD operations completed successfully!');
  } catch (error: any) {
    console.error('❌ Error during owner CRUD operations:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testOwnerCRUD();
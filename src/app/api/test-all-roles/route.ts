import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import ParkingLotOwner from '@/models/ParkingLotOwner';
import ParkingLot from '@/models/ParkingLot';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Test creating users with different roles
    const testUsers = [
      {
        name: 'Regular User',
        email: 'user@test.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Owner User',
        email: 'owner@test.com',
        password: 'password123',
        role: 'owner'
      }
    ];
    
    // Clean up existing test users
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    
    // Create test users
    const createdUsers = [];
    for (const userData of testUsers) {
      const user = new User(userData);
      const savedUser = await user.save();
      createdUsers.push({
        id: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      });
    }
    
    // Test creating an owner profile
    const ownerProfile = new ParkingLotOwner({
      userId: createdUsers[2].id, // Owner user
      businessName: 'Test Parking Company',
      contactInfo: {
        phone: '123-456-7890',
        address: '123 Test St, Test City'
      }
    });
    
    const savedOwnerProfile = await ownerProfile.save();
    
    // Test creating a parking lot
    const parkingLot = new ParkingLot({
      name: 'Test Parking Lot',
      location: 'Downtown Test City',
      availableSlots: 50,
      totalSlots: 100,
      pricePerHour: 2.50,
      imageId: 'parking-lot-1',
      operatingHours: '24/7',
      ownerId: createdUsers[2].id // Owner user
    });
    
    const savedLot = await parkingLot.save();
    
    // Add lot to owner's lots
    savedOwnerProfile.lots.push(savedLot._id.toString());
    await savedOwnerProfile.save();
    
    return NextResponse.json({
      success: true,
      message: 'All roles tested successfully',
      users: createdUsers,
      ownerProfile: {
        id: savedOwnerProfile._id.toString(),
        userId: savedOwnerProfile.userId,
        businessName: savedOwnerProfile.businessName
      },
      parkingLot: {
        id: savedLot._id.toString(),
        name: savedLot.name,
        ownerId: savedLot.ownerId
      }
    });
  } catch (error: any) {
    console.error('Test roles error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
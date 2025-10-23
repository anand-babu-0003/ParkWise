import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ParkingLot from '@/models/ParkingLot';
import ParkingLotOwner from '@/models/ParkingLotOwner';

// GET /api/owner/lots - Get all lots owned by the current user
export async function GET(req: NextRequest) {
  try {
    // In a real implementation, you would get the userId from the auth token
    // For now, we'll expect it as a query parameter for testing
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('ownerId');
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Verify the owner exists
    const owner = await ParkingLotOwner.findOne({ userId: ownerId });
    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    // Get all lots owned by this owner
    const lots = await ParkingLot.find({ ownerId: ownerId });
    
    // Convert to plain objects with id
    const result = lots.map(lot => ({
      id: lot._id.toString(),
      name: lot.name,
      location: lot.location,
      locationCoords: lot.locationCoords,
      availableSlots: lot.availableSlots,
      totalSlots: lot.totalSlots,
      pricePerHour: lot.pricePerHour,
      imageId: lot.imageId,
      operatingHours: lot.operatingHours,
      ownerId: lot.ownerId,
      createdAt: lot.createdAt,
      updatedAt: lot.updatedAt,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get owner lots error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/owner/lots - Create a new parking lot for the owner
export async function POST(req: NextRequest) {
  try {
    const { ownerId, lotData } = await req.json();
    
    if (!ownerId || !lotData) {
      return NextResponse.json(
        { error: 'Owner ID and lot data are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Verify the owner exists
    const owner = await ParkingLotOwner.findOne({ userId: ownerId });
    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    // Create new parking lot
    // Ensure locationCoords has the proper structure if provided, or set a default
    const lotDataWithCoords = {
      ...lotData,
      ownerId,
      locationCoords: lotData.locationCoords || {
        type: 'Point',
        coordinates: [0, 0] // Default coordinates, should be updated by owner
      }
    };

    const newLot = new ParkingLot(lotDataWithCoords);

    const savedLot = await newLot.save();
    
    // Add lot to owner's lots array
    owner.lots.push(savedLot._id.toString());
    await owner.save();

    const result = {
      id: savedLot._id.toString(),
      name: savedLot.name,
      location: savedLot.location,
      locationCoords: savedLot.locationCoords,
      availableSlots: savedLot.availableSlots,
      totalSlots: savedLot.totalSlots,
      pricePerHour: savedLot.pricePerHour,
      imageId: savedLot.imageId,
      operatingHours: savedLot.operatingHours,
      ownerId: savedLot.ownerId,
      createdAt: savedLot.createdAt,
      updatedAt: savedLot.updatedAt,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Create lot error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
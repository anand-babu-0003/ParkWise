import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ParkingLot from '@/models/ParkingLot';
import ParkingLotOwner from '@/models/ParkingLotOwner';

// Add this to make the route compatible with static export
export const dynamic = 'force-dynamic';

// GET /api/owner/lots - Get all parking lots for an owner
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const parkingLots = await ParkingLot.find({ ownerId });
    
    // Convert to plain objects with id
    const result = parkingLots.map(lot => ({
      id: lot._id.toString(),
      name: lot.name,
      location: lot.location,
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

// POST /api/owner/lots - Create a new parking lot for an owner
export async function POST(req: NextRequest) {
  try {
    const { ownerId, lotData } = await req.json();
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Verify owner exists
    const owner = await ParkingLotOwner.findOne({ userId: ownerId });
    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }
    
    // If location coordinates are provided, format them correctly
    const parkingLotData = { ...lotData, ownerId };
    if (lotData.latitude && lotData.longitude) {
      parkingLotData.locationCoords = {
        type: 'Point',
        coordinates: [parseFloat(lotData.longitude), parseFloat(lotData.latitude)]
      };
      // Remove individual lat/lng fields
      delete parkingLotData.latitude;
      delete parkingLotData.longitude;
    }
    
    const newParkingLot = new ParkingLot(parkingLotData);
    const savedParkingLot = await newParkingLot.save();
    
    // Add lot to owner's lots array
    owner.lots.push(savedParkingLot._id.toString());
    await owner.save();
    
    const result = {
      id: savedParkingLot._id.toString(),
      name: savedParkingLot.name,
      location: savedParkingLot.location,
      availableSlots: savedParkingLot.availableSlots,
      totalSlots: savedParkingLot.totalSlots,
      pricePerHour: savedParkingLot.pricePerHour,
      imageId: savedParkingLot.imageId,
      operatingHours: savedParkingLot.operatingHours,
      ownerId: savedParkingLot.ownerId,
      createdAt: savedParkingLot.createdAt,
      updatedAt: savedParkingLot.updatedAt,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Create owner lot error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
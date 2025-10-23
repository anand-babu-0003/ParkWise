import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ParkingLot from '@/models/ParkingLot';

// GET /api/parking-lots/[id] - Get a specific parking lot by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const parkingLot = await ParkingLot.findById(id);
    
    if (!parkingLot) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }
    
    const result = {
      id: parkingLot._id.toString(),
      name: parkingLot.name,
      location: parkingLot.location,
      availableSlots: parkingLot.availableSlots,
      totalSlots: parkingLot.totalSlots,
      pricePerHour: parkingLot.pricePerHour,
      imageId: parkingLot.imageId,
      operatingHours: parkingLot.operatingHours,
      createdAt: parkingLot.createdAt,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get parking lot error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/parking-lots/[id] - Update a specific parking lot by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connectToDatabase();
    const updatedParkingLot = await ParkingLot.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!updatedParkingLot) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }
    
    const result = {
      id: updatedParkingLot._id.toString(),
      name: updatedParkingLot.name,
      location: updatedParkingLot.location,
      availableSlots: updatedParkingLot.availableSlots,
      totalSlots: updatedParkingLot.totalSlots,
      pricePerHour: updatedParkingLot.pricePerHour,
      imageId: updatedParkingLot.imageId,
      operatingHours: updatedParkingLot.operatingHours,
      createdAt: updatedParkingLot.createdAt,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Update parking lot error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/parking-lots/[id] - Delete a specific parking lot by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const deletedParkingLot = await ParkingLot.findByIdAndDelete(id);
    
    if (!deletedParkingLot) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Parking lot deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete parking lot error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
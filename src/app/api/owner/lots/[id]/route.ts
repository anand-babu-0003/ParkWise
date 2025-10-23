import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ParkingLot from '@/models/ParkingLot';
import ParkingLotOwner from '@/models/ParkingLotOwner';

// PUT /api/owner/lots/[id] - Update a specific parking lot
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { ownerId, lotData } = await req.json();
    const { id } = await params;
    
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

    // Find the lot and verify ownership
    const lot = await ParkingLot.findById(id);
    if (!lot) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }

    if (lot.ownerId !== ownerId) {
      return NextResponse.json(
        { error: 'You do not have permission to update this lot' },
        { status: 403 }
      );
    }

    // Update the lot
    // Ensure locationCoords has the proper structure if provided
    const lotDataWithCoords = {
      ...lotData,
      locationCoords: lotData.locationCoords || lot.locationCoords
    };
    
    Object.assign(lot, lotDataWithCoords);
    const updatedLot = await lot.save();

    const result = {
      id: updatedLot._id.toString(),
      name: updatedLot.name,
      location: updatedLot.location,
      locationCoords: updatedLot.locationCoords,
      availableSlots: updatedLot.availableSlots,
      totalSlots: updatedLot.totalSlots,
      pricePerHour: updatedLot.pricePerHour,
      imageId: updatedLot.imageId,
      operatingHours: updatedLot.operatingHours,
      ownerId: updatedLot.ownerId,
      createdAt: updatedLot.createdAt,
      updatedAt: updatedLot.updatedAt,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Update lot error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/owner/lots/[id] - Delete a specific parking lot
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { ownerId } = await req.json();
    const { id } = await params;
    
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

    // Find the lot and verify ownership
    const lot = await ParkingLot.findById(id);
    if (!lot) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }

    if (lot.ownerId !== ownerId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this lot' },
        { status: 403 }
      );
    }

    // Delete the lot
    await ParkingLot.findByIdAndDelete(id);
    
    // Remove lot from owner's lots array
    owner.lots = owner.lots.filter((lotId: any) => lotId.toString() !== id);
    await owner.save();

    return NextResponse.json(
      { message: 'Parking lot deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete lot error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
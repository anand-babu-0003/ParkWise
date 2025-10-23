import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ParkingLotOwner from '@/models/ParkingLotOwner';

// Add this to make the route compatible with static export
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId, businessName, contactInfo } = await req.json();
    
    if (!userId || !businessName || !contactInfo || !contactInfo.phone || !contactInfo.address) {
      return NextResponse.json(
        { error: 'User ID, business name, and complete contact info are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Check if owner already exists
    const existingOwner = await ParkingLotOwner.findOne({ userId });
    if (existingOwner) {
      return NextResponse.json(
        { error: 'Owner profile already exists for this user' },
        { status: 409 }
      );
    }

    // Create new owner profile
    const newOwner = new ParkingLotOwner({
      userId,
      businessName,
      contactInfo,
    });

    const savedOwner = await newOwner.save();

    // Return owner data
    const ownerData = {
      id: savedOwner._id.toString(),
      userId: savedOwner.userId,
      businessName: savedOwner.businessName,
      contactInfo: savedOwner.contactInfo,
      lots: savedOwner.lots,
      createdAt: savedOwner.createdAt,
    };

    return NextResponse.json(
      { owner: ownerData },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Owner registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
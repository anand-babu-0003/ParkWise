import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ParkingLotOwner from '@/models/ParkingLotOwner';

// Add this to make the route compatible with static export
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Check if owner profile exists
    const ownerProfile = await ParkingLotOwner.findOne({ userId });
    
    if (!ownerProfile) {
      return NextResponse.json(
        { error: 'Owner profile not found' },
        { status: 404 }
      );
    }

    // Return owner profile data
    const ownerData = {
      id: ownerProfile._id.toString(),
      userId: ownerProfile.userId,
      businessName: ownerProfile.businessName,
      contactInfo: ownerProfile.contactInfo,
      lots: ownerProfile.lots,
      createdAt: ownerProfile.createdAt,
    };

    return NextResponse.json(
      { owner: ownerData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching owner profile:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
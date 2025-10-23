import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ParkingLot from '@/models/ParkingLot';

// GET /api/parking-lots/[id]/qr - Get QR code data for a parking lot
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Find the parking lot
    const lot = await ParkingLot.findById(params.id);
    if (!lot) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }

    // Generate QR code data (URL to the lot page)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const lotUrl = `${baseUrl}/lot/${lot._id.toString()}`;
    
    // Return QR code data
    const result = {
      id: lot._id.toString(),
      name: lot.name,
      location: lot.location,
      qrData: lotUrl,
      qrCodeUrl: `/api/qr?data=${encodeURIComponent(lotUrl)}`,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get QR code data error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
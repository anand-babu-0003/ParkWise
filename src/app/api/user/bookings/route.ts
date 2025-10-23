import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    
    return Response.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Booking from '@/models/Booking';
import ParkingLot from '@/models/ParkingLot';

// GET /api/bookings - Get all bookings
export async function GET() {
  try {
    await connectToDatabase();
    const bookings = await Booking.find({});
    
    // Convert to plain objects with id
    const result = bookings.map(booking => ({
      id: booking._id.toString(),
      userId: booking.userId,
      lotId: booking.lotId,
      lotName: booking.lotName,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      price: booking.price,
      createdAt: booking.createdAt,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    await connectToDatabase();
    
    // First create the booking
    const newBooking = new Booking(body);
    const savedBooking = await newBooking.save();
    
    // Then update the parking lot's available slots
    const parkingLot = await ParkingLot.findById(body.lotId);
    if (parkingLot && parkingLot.availableSlots > 0) {
      parkingLot.availableSlots -= 1;
      await parkingLot.save();
    }
    
    const result = {
      id: savedBooking._id.toString(),
      userId: savedBooking.userId,
      lotId: savedBooking.lotId,
      lotName: savedBooking.lotName,
      date: savedBooking.date,
      time: savedBooking.time,
      status: savedBooking.status,
      price: savedBooking.price,
      createdAt: savedBooking.createdAt,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
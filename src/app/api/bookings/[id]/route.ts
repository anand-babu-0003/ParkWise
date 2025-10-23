import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Booking from '@/models/Booking';
import ParkingLot from '@/models/ParkingLot';

// GET /api/bookings/[id] - Get a specific booking by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    const result = {
      id: booking._id.toString(),
      userId: booking.userId,
      lotId: booking.lotId,
      lotName: booking.lotName,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      price: booking.price,
      createdAt: booking.createdAt,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update a specific booking by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connectToDatabase();
    
    // Get the existing booking to check status changes
    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // If the booking status is changing from cancelled to confirmed, 
    // we need to decrease available slots
    if (existingBooking.status === 'Cancelled' && body.status === 'Confirmed') {
      const parkingLot = await ParkingLot.findById(existingBooking.lotId);
      if (parkingLot && parkingLot.availableSlots > 0) {
        parkingLot.availableSlots -= 1;
        await parkingLot.save();
      }
    }
    // If the booking status is changing from confirmed to cancelled,
    // we need to increase available slots
    else if (existingBooking.status === 'Confirmed' && body.status === 'Cancelled') {
      const parkingLot = await ParkingLot.findById(existingBooking.lotId);
      if (parkingLot) {
        parkingLot.availableSlots += 1;
        await parkingLot.save();
      }
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!updatedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    const result = {
      id: updatedBooking._id.toString(),
      userId: updatedBooking.userId,
      lotId: updatedBooking.lotId,
      lotName: updatedBooking.lotName,
      date: updatedBooking.date,
      time: updatedBooking.time,
      status: updatedBooking.status,
      price: updatedBooking.price,
      createdAt: updatedBooking.createdAt,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Delete a specific booking by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    // Get the booking to update parking lot slots
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // If the booking was confirmed, increase available slots when deleting
    if (booking.status === 'Confirmed') {
      const parkingLot = await ParkingLot.findById(booking.lotId);
      if (parkingLot) {
        parkingLot.availableSlots += 1;
        await parkingLot.save();
      }
    }
    
    const deletedBooking = await Booking.findByIdAndDelete(id);
    
    if (!deletedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
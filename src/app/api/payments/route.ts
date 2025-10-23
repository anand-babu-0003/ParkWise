import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Payment from '@/models/Payment';

// GET /api/payments - Get all payments
export async function GET() {
  try {
    await connectToDatabase();
    const payments = await Payment.find({});
    
    // Convert to plain objects with id
    const result = payments.map(payment => ({
      id: payment._id.toString(),
      bookingId: payment.bookingId,
      userId: payment.userId,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create a new payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    await connectToDatabase();
    const newPayment = new Payment(body);
    const savedPayment = await newPayment.save();
    
    const result = {
      id: savedPayment._id.toString(),
      bookingId: savedPayment.bookingId,
      userId: savedPayment.userId,
      amount: savedPayment.amount,
      status: savedPayment.status,
      createdAt: savedPayment.createdAt,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
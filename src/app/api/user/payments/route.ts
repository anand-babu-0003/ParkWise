import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Payment from '@/models/Payment';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    
    return Response.json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return Response.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
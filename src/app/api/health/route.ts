import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

// Add this to make the route compatible with static export
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Try a simple database query
    const userCount = await User.countDocuments();
    
    return NextResponse.json(
      { 
        status: 'ok',
        database: 'connected',
        userCount
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        database: 'disconnected',
        error: error.message
      },
      { status: 500 }
    );
  }
}
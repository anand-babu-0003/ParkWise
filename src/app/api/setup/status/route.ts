import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

// Add this to make the route compatible with static export
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Check if an admin user already exists
    const adminUser = await User.findOne({ role: 'admin' });
    
    return NextResponse.json(
      { 
        isSetupComplete: !!adminUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Setup status check error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    let errorStatus = 500;
    
    if (error && typeof error === 'object') {
      if (error.message?.includes('MongoServerSelectionError') || error.message?.includes('connect ECONNREFUSED')) {
        errorMessage = 'Database connection failed. Please check your MongoDB configuration and network settings.';
        errorStatus = 503; // Service Unavailable
      } else if (error.message?.includes('Authentication failed')) {
        errorMessage = 'Database authentication failed. Please check your MongoDB credentials.';
        errorStatus = 401; // Unauthorized
      } else {
        errorMessage = error.message || errorMessage;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        // Add more details in development
        ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
      },
      { status: errorStatus }
    );
  }
}
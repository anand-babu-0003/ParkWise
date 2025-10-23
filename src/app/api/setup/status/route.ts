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
    // Provide more detailed error information
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        // Don't expose sensitive information in production
        details: process.env.NODE_ENV === 'development' ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : undefined
      },
      { status: 500 }
    );
  }
}
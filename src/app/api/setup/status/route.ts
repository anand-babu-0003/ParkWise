import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

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
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
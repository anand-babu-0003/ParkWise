import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    // List all users
    const users = await User.find({}, 'name email role');
    
    return NextResponse.json(
      { 
        success: true, 
        users: users.map(user => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        }))
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error listing users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to list users'
      },
      { status: 500 }
    );
  }
}
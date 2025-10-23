import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    await connectToDatabase();
    
    // Debug: Log the incoming credentials
    console.log('Login attempt with email:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', debug: { email } },
        { status: 401 }
      );
    }
    
    // Log user details (without password)
    console.log('User details:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password', debug: { email } },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Login would be successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Debug login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
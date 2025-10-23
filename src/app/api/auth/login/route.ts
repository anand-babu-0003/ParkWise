import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

// Add this to make the route compatible with static export
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let email, password;
    
    try {
      const body = await req.json();
      email = body.email;
      password = body.password;
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body. Please provide email and password.' },
        { status: 400 }
      );
    }
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user data and token
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Determine redirect URL based on role
    let redirectUrl = '/';
    switch (user.role) {
      case 'admin':
        redirectUrl = '/admin/dashboard';
        break;
      case 'owner':
        redirectUrl = '/owner/dashboard';
        break;
      case 'user':
        redirectUrl = '/user/dashboard';
        break;
    }

    const response = NextResponse.json(
      { user: userData, token, redirectUrl },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Ensure we always return valid JSON
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

// Add this to make the route compatible with static export
export const dynamic = 'force-dynamic';

// GET /api/qr - Generate QR code as data URL
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get('data');
    
    if (!data) {
      return NextResponse.json(
        { error: 'Data parameter is required' },
        { status: 400 }
      );
    }

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return NextResponse.json({ qrCode: qrDataUrl }, { status: 200 });
  } catch (error: any) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
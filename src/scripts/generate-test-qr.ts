import QRCode from 'qrcode';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateTestQRCode() {
  try {
    // Generate a test QR code for a sample parking lot
    const testUrl = 'http://localhost:9002/lot/test-lot-123';
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(testUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    console.log('Test QR Code generated successfully!');
    console.log('You can test the scanner with this URL:', testUrl);
    console.log('Data URL length:', qrDataUrl.length);
    
    // Also save as SVG for reference
    const qrSvg = await QRCode.toString(testUrl, {
      type: 'svg',
      width: 300,
      margin: 2
    });
    
    // Save SVG to file
    const outputPath = join(process.cwd(), 'test-qr-code.svg');
    writeFileSync(outputPath, qrSvg);
    console.log('SVG saved to:', outputPath);
    
  } catch (error) {
    console.error('Error generating test QR code:', error);
  }
}

generateTestQRCode();
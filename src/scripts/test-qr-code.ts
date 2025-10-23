import QRCode from 'qrcode';

async function testQRCode() {
  try {
    const testData = 'https://smartparkr.example.com/lot/123';
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(testData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    console.log('QR Code generated successfully!');
    console.log('Data URL length:', qrDataUrl.length);
    
    // Also test SVG generation
    const qrSvg = await QRCode.toString(testData, {
      type: 'svg',
      width: 300,
      margin: 2
    });
    
    console.log('SVG generated successfully!');
    console.log('SVG length:', qrSvg.length);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}

testQRCode();
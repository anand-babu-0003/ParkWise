/**
 * Test script to verify all API endpoints
 */

async function testAPIs() {
  // Try localhost first
  const urls = [
    'http://localhost:9002',
    'http://localhost:9004',
    'https://smartparker.space'
  ];
  
  let baseUrl = '';
  let isLocal = false;
  
  // Find which URL is accessible
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${url}/api/setup/status`, { 
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        baseUrl = url;
        isLocal = url.includes('localhost');
        console.log(`Using ${isLocal ? 'local' : 'production'} server: ${baseUrl}`);
        break;
      }
    } catch (error: any) {
      console.log(`Could not connect to ${url}:`, error.message);
      // Continue to next URL
    }
  }
  
  if (!baseUrl) {
    console.log('No accessible server found. Please ensure the application is running.');
    return;
  }
  
  console.log('Testing SmartParkr APIs on', baseUrl);
  console.log('=====================================\n');
  
  try {
    // Test 1: Setup Status API
    console.log('1. Testing Setup Status API...');
    const setupStatusResponse = await fetch(`${baseUrl}/api/setup/status`);
    const setupStatusText = await setupStatusResponse.text();
    
    try {
      const setupStatusData = JSON.parse(setupStatusText);
      console.log('- Status:', setupStatusResponse.status);
      console.log('- Response:', setupStatusData);
    } catch (jsonError) {
      console.log('- Status:', setupStatusResponse.status);
      console.log('- Response is not JSON:', setupStatusText.substring(0, 100) + '...');
      if (setupStatusText.includes('DOCTYPE') || setupStatusText.includes('<html')) {
        console.log('- Note: This appears to be an HTML page, not the expected API response');
      }
    }
    console.log('');

    // Test 2: Health Check API (if exists)
    console.log('2. Testing Health Check API...');
    try {
      const healthResponse = await fetch(`${baseUrl}/api/health`);
      const healthText = await healthResponse.text();
      
      try {
        const healthData = JSON.parse(healthText);
        console.log('- Status:', healthResponse.status);
        console.log('- Response:', healthData);
      } catch (jsonError) {
        console.log('- Status:', healthResponse.status);
        console.log('- Response is not JSON:', healthText.substring(0, 100) + '...');
      }
    } catch (error) {
      console.log('- Health API not available');
    }
    console.log('');

    // Test 3: Parking Lots API
    console.log('3. Testing Parking Lots API...');
    const parkingLotsResponse = await fetch(`${baseUrl}/api/parking-lots`);
    const parkingLotsText = await parkingLotsResponse.text();
    
    try {
      const parkingLotsData = JSON.parse(parkingLotsText);
      console.log('- Status:', parkingLotsResponse.status);
      console.log('- Response type:', Array.isArray(parkingLotsData) ? 'Array' : typeof parkingLotsData);
      if (Array.isArray(parkingLotsData)) {
        console.log('- Number of lots:', parkingLotsData.length);
      }
    } catch (jsonError) {
      console.log('- Status:', parkingLotsResponse.status);
      console.log('- Response is not JSON:', parkingLotsText.substring(0, 100) + '...');
    }
    console.log('');

    // Test 4: Users API
    console.log('4. Testing Users API (unauthenticated)...');
    const usersResponse = await fetch(`${baseUrl}/api/users`);
    console.log('- Status:', usersResponse.status);
    if (usersResponse.status === 401) {
      console.log('- Response: Unauthorized (expected for unauthenticated requests)');
    } else {
      const usersText = await usersResponse.text();
      try {
        const usersData = JSON.parse(usersText);
        console.log('- Response:', usersData);
      } catch (jsonError) {
        console.log('- Response is not JSON:', usersText.substring(0, 100) + '...');
      }
    }
    console.log('');

    // Test 5: Auth API
    console.log('5. Testing Auth API (login with invalid credentials)...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });
    
    const loginText = await loginResponse.text();
    try {
      const loginData = JSON.parse(loginText);
      console.log('- Status:', loginResponse.status);
      console.log('- Response:', loginData);
    } catch (jsonError) {
      console.log('- Status:', loginResponse.status);
      console.log('- Response is not JSON:', loginText.substring(0, 100) + '...');
    }
    console.log('');

    // Test 6: QR Code API
    console.log('6. Testing QR Code API...');
    const qrResponse = await fetch(`${baseUrl}/api/qr?data=${encodeURIComponent(`${baseUrl}/test`)}`);
    const qrText = await qrResponse.text();
    
    try {
      const qrData = JSON.parse(qrText);
      console.log('- Status:', qrResponse.status);
      console.log('- Has QR code:', !!qrData.qrCode);
    } catch (jsonError) {
      console.log('- Status:', qrResponse.status);
      console.log('- Response is not JSON:', qrText.substring(0, 100) + '...');
    }
    console.log('');

    console.log('API tests completed!');
    if (isLocal) {
      console.log('Note: These tests were run against a local development server.');
      console.log('To test against the production server, deploy the application to smartparker.space');
    } else {
      console.log('Note: These tests were run against the production server.');
    }

  } catch (error) {
    console.error('Error testing APIs:', error);
  }
}

testAPIs();
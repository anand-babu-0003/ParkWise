/**
 * Test script to verify login API functionality
 */

async function testLoginAPI() {
  console.log('Testing Login API...\n');
  
  // Use the configured base URL or default to localhost for testing
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  
  try {
    // Test with invalid credentials (should return 401)
    const invalidResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });
    
    const invalidData = await invalidResponse.json();
    console.log('Invalid credentials test:');
    console.log('- Status:', invalidResponse.status);
    console.log('- Response:', invalidData);
    console.log('');
    
    // Test with missing fields (should return 400)
    const missingFieldsResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        // missing password
      }),
    });
    
    const missingFieldsData = await missingFieldsResponse.json();
    console.log('Missing fields test:');
    console.log('- Status:', missingFieldsResponse.status);
    console.log('- Response:', missingFieldsData);
    console.log('');
    
    // Test with invalid JSON (should return 400)
    const invalidJSONResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });
    
    const invalidJSONData = await invalidJSONResponse.json();
    console.log('Invalid JSON test:');
    console.log('- Status:', invalidJSONResponse.status);
    console.log('- Response:', invalidJSONData);
    console.log('');
    
    console.log('Login API tests completed!');
    
  } catch (error) {
    console.error('Error testing login API:', error);
  }
}

testLoginAPI();
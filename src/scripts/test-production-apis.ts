/**
 * Test script to verify all API endpoints specifically on smartparker.space
 */

async function testProductionAPIs() {
  const baseUrl = 'https://smartparker.space';
  
  console.log('Testing SmartParkr APIs on production server:', baseUrl);
  console.log('===============================================\n');
  
  try {
    // Test 1: Setup Status API
    console.log('1. Testing Setup Status API...');
    try {
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
          console.log('- Note: This appears to be an HTML page. The application may not be deployed yet.');
        }
      }
    } catch (error: any) {
      console.log('- Error connecting to API:', error.message);
      console.log('- Note: The application may not be deployed to smartparker.space yet.');
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
    } catch (error: any) {
      console.log('- Health API not available or not deployed yet:', error.message);
    }
    console.log('');

    console.log('Production API tests completed!');
    console.log('Note: If you see HTML responses or connection errors, the application may not be deployed to smartparker.space yet.');
    console.log('To deploy the application:');
    console.log('1. Push the code to a GitHub repository');
    console.log('2. Connect the repository to Vercel');
    console.log('3. Set the environment variables in Vercel:');
    console.log('   - MONGO_URI: Your MongoDB connection string');
    console.log('   - JWT_SECRET: Your JWT secret key');
    console.log('4. Deploy the application');
    console.log('5. Configure the custom domain "smartparker.space" in Vercel settings');

  } catch (error) {
    console.error('Error testing production APIs:', error);
  }
}

testProductionAPIs();
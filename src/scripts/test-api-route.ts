/**
 * Test script to verify API route functionality
 */

// Mock the NextRequest and NextResponse for testing
class MockNextRequest {
  url: string;
  
  constructor(url: string) {
    this.url = url;
  }
  
  get cookies() {
    return {
      get: () => undefined
    };
  }
}

// Mock NextResponse
const MockNextResponse = {
  json: (data: any, options?: { status?: number }) => {
    console.log('MockNextResponse.json called with:', data);
    console.log('Status:', options?.status || 200);
    return {
      json: data,
      status: options?.status || 200
    };
  }
};

// Import the actual API route function
async function testSetupAPIRoute() {
  console.log('Testing Setup API Route Function...\n');
  
  try {
    // Dynamically import the route handler
    const routeModule = await import('../app/api/setup/status/route');
    
    if (routeModule.GET) {
      console.log('Route handler found, testing...');
      
      // Create a mock request
      const mockRequest = new MockNextRequest('http://localhost:9002/api/setup/status');
      
      // Call the route handler
      const result = await routeModule.GET(mockRequest, {});
      console.log('Route handler executed successfully');
      console.log('Result:', result);
    } else {
      console.log('GET handler not found in route module');
    }
    
  } catch (error) {
    console.error('Error testing API route:', error);
  }
}

testSetupAPIRoute();
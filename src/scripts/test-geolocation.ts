/**
 * Test script to verify geolocation functionality
 * This script simulates the geolocation API calls that would be made in the browser
 */

// Mock geolocation data for testing
const mockGeolocationData = {
  coords: {
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: 100,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: Date.now()
};

// Mock geolocation API for testing
const mockGeolocation = {
  getCurrentPosition: (successCallback: Function, errorCallback: Function, options: Object) => {
    console.log('Mock geolocation: Getting current position...');
    
    // Simulate a delay
    setTimeout(() => {
      // 80% chance of success, 20% chance of error
      if (Math.random() > 0.2) {
        console.log('Mock geolocation: Position acquired successfully');
        successCallback(mockGeolocationData);
      } else {
        console.log('Mock geolocation: Permission denied (simulated)');
        errorCallback({
          code: 1, // PERMISSION_DENIED
          message: 'User denied the request for Geolocation.'
        });
      }
    }, 1000);
  }
};

// Test the geolocation functionality
async function testGeolocation() {
  console.log('Testing geolocation functionality...');
  
  // In a real browser environment, we would use navigator.geolocation
  // For this test, we'll use our mock
  const geolocation = mockGeolocation;
  
  if (!geolocation) {
    console.error('Geolocation is not supported');
    return;
  }
  
  console.log('Geolocation is supported, requesting position...');
  
  geolocation.getCurrentPosition(
    (position: any) => {
      const { latitude, longitude } = position.coords;
      console.log('✅ Geolocation success:');
      console.log(`  Latitude: ${latitude}`);
      console.log(`  Longitude: ${longitude}`);
      console.log(`  Accuracy: ${position.coords.accuracy} meters`);
      
      // Test converting to the format we use in our application
      const locationCoords = {
        type: 'Point' as const,
        coordinates: [longitude, latitude] // [longitude, latitude]
      };
      
      console.log('✅ Formatted location coordinates:');
      console.log(JSON.stringify(locationCoords, null, 2));
    },
    (error: any) => {
      console.error('❌ Geolocation error:');
      switch (error.code) {
        case 1:
          console.error('  PERMISSION_DENIED: User denied the request for Geolocation.');
          break;
        case 2:
          console.error('  POSITION_UNAVAILABLE: Location information is unavailable.');
          break;
        case 3:
          console.error('  TIMEOUT: The request to get user location timed out.');
          break;
        default:
          console.error('  UNKNOWN_ERROR: An unknown error occurred.');
          break;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}

// Run the test
testGeolocation();

export { mockGeolocation };
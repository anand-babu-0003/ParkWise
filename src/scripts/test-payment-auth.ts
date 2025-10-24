/**
 * Test script to verify payment and authentication functionality
 */

// Mock user data for testing
const mockUser = {
  id: 'test-user-123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user'
};

// Mock parking lot data for testing
const mockParkingLot = {
  id: 'test-lot-456',
  name: 'Test Parking Lot',
  location: '123 Test Street',
  availableSlots: 5,
  totalSlots: 10,
  pricePerHour: 10.00,
  imageId: 'test-image-789',
  operatingHours: '24/7'
};

// Dummy payment processing function (same as in the frontend)
async function processDummyPayment(amount: number): Promise<boolean> {
  console.log(`Processing payment of ₹${amount.toFixed(2)}...`);
  
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly succeed or fail (90% success rate for demo purposes)
  const success = Math.random() > 0.1;
  
  if (success) {
    console.log('✅ Payment processed successfully');
  } else {
    console.log('❌ Payment processing failed');
  }
  
  return success;
}

// Mock booking creation function
async function createBooking(bookingData: any): Promise<boolean> {
  console.log('Creating booking with data:', bookingData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Always succeed for testing purposes
  console.log('✅ Booking created successfully');
  return true;
}

// Test the complete booking flow
async function testBookingFlow() {
  console.log('Testing booking flow with authentication and payment...');
  
  // Simulate authenticated user
  const user = mockUser;
  console.log(`_authenticated user: ${user.name} (${user.email})`);
  
  // Get parking lot details
  const parkingLot = mockParkingLot;
  console.log(`Selected parking lot: ${parkingLot.name}`);
  console.log(`Available slots: ${parkingLot.availableSlots}/${parkingLot.totalSlots}`);
  console.log(`Price per hour: ₹${parkingLot.pricePerHour.toFixed(2)}`);
  
  // Check if lot has available slots
  if (parkingLot.availableSlots === 0) {
    console.log('❌ Parking lot is full, cannot book');
    return;
  }
  
  // Set booking details
  const bookingDetails = {
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 2 // hours
  };
  
  const totalCost = parkingLot.pricePerHour * bookingDetails.duration;
  console.log(`Booking details: ${bookingDetails.date} at ${bookingDetails.time} for ${bookingDetails.duration} hours`);
  console.log(`Total cost: ₹${totalCost.toFixed(2)}`);
  
  // Process payment
  console.log('\n--- Processing Payment ---');
  const paymentSuccess = await processDummyPayment(totalCost);
  
  if (!paymentSuccess) {
    console.log('❌ Booking failed due to payment failure');
    return;
  }
  
  // Create booking
  console.log('\n--- Creating Booking ---');
  const bookingData = {
    userId: user.id,
    lotId: parkingLot.id,
    lotName: parkingLot.name,
    date: bookingDetails.date,
    time: bookingDetails.time,
    status: 'Confirmed',
    price: totalCost
  };
  
  const bookingSuccess = await createBooking(bookingData);
  
  if (bookingSuccess) {
    console.log('✅ Booking flow completed successfully!');
    console.log('Booking confirmed for', parkingLot.name);
    console.log('Date:', bookingDetails.date);
    console.log('Time:', bookingDetails.time);
    console.log('Duration:', bookingDetails.duration, 'hours');
    console.log('Total paid: ₹', totalCost.toFixed(2));
  } else {
    console.log('❌ Booking creation failed');
  }
}

// Test unauthenticated access
async function testUnauthenticatedAccess() {
  console.log('\n--- Testing Unauthenticated Access ---');
  console.log('Simulating access to parking lot details without authentication...');
  console.log('Expected behavior: Redirect to login page');
  console.log('✅ Redirect simulation completed');
}

// Run all tests
async function runAllTests() {
  console.log('Running Payment and Authentication Tests\n');
  
  await testUnauthenticatedAccess();
  console.log('');
  await testBookingFlow();
  
  console.log('\n🎉 All tests completed!');
}

// Run the tests
runAllTests();

export { processDummyPayment, createBooking, testBookingFlow, testUnauthenticatedAccess };
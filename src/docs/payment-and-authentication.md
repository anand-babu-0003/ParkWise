# Payment Gateway and Authentication Documentation

## Overview

This document explains the implementation of the dummy payment gateway and authentication requirements for booking parking slots in the SmartParkr application.

## Authentication Requirements

### User Authentication for Booking
- Users must be authenticated before they can book parking slots
- Unauthenticated users are automatically redirected to the login page when attempting to access a parking lot details page
- After successful login, users are redirected back to the original parking lot details page

### Implementation Details
1. The [mobile-lot-details.tsx](file:///c:/Users/basav/OneDrive/Documents/GitHub/ParkWise/src/app/mobile-lot-details.tsx) component uses the `useAuth` hook to check authentication status
2. If a user is not authenticated, they are redirected to `/login?redirect=/lot/{lotId}`
3. The login page preserves the redirect URL so users return to the lot details after authentication

## Dummy Payment Gateway

### Implementation
A simple dummy payment gateway has been implemented to simulate the payment process:

```typescript
async function processDummyPayment(amount: number): Promise<boolean> {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly succeed or fail (90% success rate for demo purposes)
  return Math.random() > 0.1;
}
```

### Features
- Simulates a 1.5 second payment processing delay
- 90% success rate for demonstration purposes
- Returns a boolean indicating payment success or failure

### Integration with Booking Process
1. When a user clicks "Confirm Booking", the payment process is initiated first
2. If payment succeeds, the booking is created via the API
3. If payment fails, the user is notified and the booking is not created
4. Successful bookings update the parking lot's available slots count

## API Endpoints

### Booking Management
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/user` - Get current user information

## Data Models

### Booking Model
```typescript
interface IBooking extends Document {
  userId: string;
  lotId: string;
  lotName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  price: number;
  createdAt: Date;
}
```

## Security Considerations

1. All booking requests require a valid user ID from the authentication context
2. Booking creation is protected by the dummy payment gateway
3. Available slot counts are automatically updated when bookings are created
4. Authentication status is checked on every parking lot details page access

## Testing

### Manual Testing
1. Try to access a parking lot details page without being logged in
   - Should redirect to login page
   - After login, should redirect back to the lot details page

2. Try to book a parking slot
   - Should process a dummy payment first
   - If payment succeeds, booking should be created
   - If payment fails, user should see an error message

3. Try to book a parking slot when the lot is full
   - The "Confirm Booking" button should be disabled
   - A "Lot Full" message should be displayed

## Future Improvements

1. Integrate with a real payment gateway (e.g., Stripe, PayPal)
2. Add payment method selection (credit card, debit card, digital wallets)
3. Implement payment confirmation emails
4. Add booking confirmation SMS notifications
5. Implement booking cancellation and refund functionality
6. Add booking history and management features
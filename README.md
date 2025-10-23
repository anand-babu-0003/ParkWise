# SmartParkr

SmartParkr is a modern parking management application that helps users find, book, and pay for parking slots in real-time. The application features a mobile-first design with role-based access control for users, parking lot owners, and administrators.

## Features

- **User Management**: Role-based access for users, owners, and admins
- **Parking Lot Management**: Owners can register and manage their parking lots
- **Real-time Booking**: Users can search and book parking slots
- **Location Services**: Find parking lots near your current location
- **QR Code Integration**: Generate and scan QR codes for parking validation
- **Payment Processing**: Secure payment handling for bookings
- **Mobile-First Design**: Responsive design optimized for mobile devices

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd smartparkr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the following environment variables in Vercel:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
4. Deploy the application

### Mobile App Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Sync with Capacitor:
   ```bash
   npx cap sync
   ```

3. Open in Android Studio:
   ```bash
   npx cap open android
   ```

4. Build the APK or App Bundle in Android Studio

## Environment Variables

- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NEXT_PUBLIC_BASE_URL`: Base URL for the application (optional)

## API Endpoints

- `/api/auth/*`: Authentication endpoints
- `/api/users/*`: User management endpoints
- `/api/owner/*`: Owner-specific endpoints
- `/api/parking-lots/*`: Parking lot management endpoints
- `/api/bookings/*`: Booking management endpoints
- `/api/payments/*`: Payment processing endpoints

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
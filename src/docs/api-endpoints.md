# SmartParkr API Endpoints

This document provides an overview of all available API endpoints in the SmartParkr application.

## Base URL

- Local Development: `http://localhost:9002`
- Production: `https://smartparker.space`

## Authentication APIs

### POST `/api/auth/login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user|owner|admin"
  },
  "token": "jwt_token",
  "redirectUrl": "/user/dashboard|/owner/dashboard|/admin/dashboard"
}
```

### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "user|owner" // Optional, defaults to "user"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user|owner"
  }
}
```

### GET `/api/auth/user`
Get the current authenticated user's information.

**Headers:**
```
Cookie: authToken=jwt_token
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user|owner|admin"
  }
}
```

### POST `/api/auth/logout`
Logout the current user (clears the auth token).

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Setup APIs

### GET `/api/setup/status`
Check if the initial admin user has been created.

**Response:**
```json
{
  "isSetupComplete": true|false
}
```

### POST `/api/setup/admin`
Create the initial admin user (only available when no admin exists).

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Admin user created successfully",
  "user": {
    "id": "user_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## User APIs

### GET `/api/users`
Get all users (admin only).

**Headers:**
```
Cookie: authToken=jwt_token
```

**Response:**
```json
[
  {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user|owner|admin",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### GET `/api/users/[id]`
Get a specific user by ID.

**Headers:**
```
Cookie: authToken=jwt_token
```

**Response:**
```json
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "user|owner|admin",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### PUT `/api/users/[id]`
Update a specific user by ID.

**Headers:**
```
Cookie: authToken=jwt_token
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "user|owner|admin"
}
```

**Response:**
```json
{
  "id": "user_id",
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "user|owner|admin",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### DELETE `/api/users/[id]`
Delete a specific user by ID.

**Headers:**
```
Cookie: authToken=jwt_token
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Parking Lot APIs

### GET `/api/parking-lots`
Get all parking lots with optional filtering.

**Query Parameters:**
- `search`: Search term for name or location
- `lat`: Latitude for location-based search
- `lng`: Longitude for location-based search
- `radius`: Radius in kilometers (default: 5)

**Response:**
```json
[
  {
    "id": "lot_id",
    "name": "Parking Lot Name",
    "location": "Lot Location",
    "availableSlots": 10,
    "totalSlots": 20,
    "pricePerHour": 2.5,
    "imageId": "image_id",
    "operatingHours": "24/7",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### POST `/api/parking-lots`
Create a new parking lot (owner only).

**Headers:**
```
Cookie: authToken=jwt_token
```

**Request Body:**
```json
{
  "name": "Parking Lot Name",
  "location": "Lot Location",
  "availableSlots": 10,
  "totalSlots": 20,
  "pricePerHour": 2.5,
  "imageId": "image_id",
  "operatingHours": "24/7",
  "latitude": 12.3456,
  "longitude": 78.9012
}
```

**Response:**
```json
{
  "id": "lot_id",
  "name": "Parking Lot Name",
  "location": "Lot Location",
  "availableSlots": 10,
  "totalSlots": 20,
  "pricePerHour": 2.5,
  "imageId": "image_id",
  "operatingHours": "24/7",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## Owner APIs

### POST `/api/owner/register`
Register as a parking lot owner.

**Headers:**
```
Cookie: authToken=jwt_token
```

**Request Body:**
```json
{
  "userId": "user_id",
  "businessName": "Business Name",
  "contactInfo": {
    "phone": "123-456-7890",
    "address": "Business Address"
  }
}
```

**Response:**
```json
{
  "owner": {
    "id": "owner_id",
    "userId": "user_id",
    "businessName": "Business Name",
    "contactInfo": {
      "phone": "123-456-7890",
      "address": "Business Address"
    },
    "lots": [],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### GET `/api/owner/profile`
Get owner profile information.

**Query Parameters:**
- `userId`: User ID

**Response:**
```json
{
  "owner": {
    "id": "owner_id",
    "userId": "user_id",
    "businessName": "Business Name",
    "contactInfo": {
      "phone": "123-456-7890",
      "address": "Business Address"
    },
    "lots": ["lot_id1", "lot_id2"],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### GET `/api/owner/lots`
Get all parking lots for an owner.

**Query Parameters:**
- `ownerId`: Owner ID

**Response:**
```json
[
  {
    "id": "lot_id",
    "name": "Parking Lot Name",
    "location": "Lot Location",
    "availableSlots": 10,
    "totalSlots": 20,
    "pricePerHour": 2.5,
    "imageId": "image_id",
    "operatingHours": "24/7",
    "ownerId": "owner_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### POST `/api/owner/lots`
Create a new parking lot for an owner.

**Headers:**
```
Cookie: authToken=jwt_token
```

**Request Body:**
```json
{
  "ownerId": "owner_id",
  "lotData": {
    "name": "Parking Lot Name",
    "location": "Lot Location",
    "availableSlots": 10,
    "totalSlots": 20,
    "pricePerHour": 2.5,
    "imageId": "image_id",
    "operatingHours": "24/7"
  }
}
```

**Response:**
```json
{
  "id": "lot_id",
  "name": "Parking Lot Name",
  "location": "Lot Location",
  "availableSlots": 10,
  "totalSlots": 20,
  "pricePerHour": 2.5,
  "imageId": "image_id",
  "operatingHours": "24/7",
  "ownerId": "owner_id",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### PUT `/api/owner/lots/[id]`
Update a specific parking lot.

**Headers:**
```
Cookie: authToken=jwt_token
```

**Request Body:**
```json
{
  "ownerId": "owner_id",
  "lotData": {
    "name": "Updated Parking Lot Name",
    "location": "Updated Lot Location",
    "availableSlots": 15,
    "totalSlots": 25,
    "pricePerHour": 3.0,
    "imageId": "updated_image_id",
    "operatingHours": "8AM-8PM"
  }
}
```

**Response:**
```json
{
  "id": "lot_id",
  "name": "Updated Parking Lot Name",
  "location": "Updated Lot Location",
  "availableSlots": 15,
  "totalSlots": 25,
  "pricePerHour": 3.0,
  "imageId": "updated_image_id",
  "operatingHours": "8AM-8PM",
  "ownerId": "owner_id",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

### DELETE `/api/owner/lots/[id]`
Delete a specific parking lot.

**Headers:**
```
Cookie: authToken=jwt_token
```

**Request Body:**
```json
{
  "ownerId": "owner_id"
}
```

**Response:**
```json
{
  "message": "Parking lot deleted successfully"
}
```

## QR Code API

### GET `/api/qr`
Generate a QR code for a given URL.

**Query Parameters:**
- `data`: URL to encode in the QR code

**Response:**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## Health Check API

### GET `/api/health`
Check the health of the application and database.

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "userCount": 3
}
```

## Error Responses

All APIs return appropriate HTTP status codes and JSON error responses:

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid credentials
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

**Error Response Format:**
```json
{
  "error": "Error message"
}
```
# Owner Functionality Documentation

## Overview

This document explains the owner functionality in the SmartParkr application, including registration, parking lot management, and CRUD operations.

## Owner Registration Flow

### 1. User Registration with Owner Role
- Users select "owner" role during initial registration
- Upon successful registration, they are redirected to complete their business profile

### 2. Business Profile Registration
- Owners must complete their business profile at `/owner/register`
- Required information:
  - Business Name
  - Phone Number
  - Business Address

### 3. Dashboard Access
- After completing registration, owners can access their dashboard at `/owner/dashboard`

## Parking Lot Management

### CRUD Operations

#### Create (Add) Parking Lot
- Owners can add new parking lots through the dashboard
- Required fields:
  - Lot Name
  - Location
  - Location Coordinates (latitude and longitude)
  - Total Slots
  - Available Slots
  - Price per Hour
  - Operating Hours
  - Image ID (for lot image)

#### Read (View) Parking Lots
- Owners can view all their parking lots in a list format
- Each lot displays key information:
  - Name and location
  - Slot availability
  - Pricing information
  - Operating hours

#### Update (Edit) Parking Lot
- Owners can edit existing parking lot details
- All fields can be modified except the owner ID

#### Delete Parking Lot
- Owners can delete their parking lots
- Confirmation is required before deletion

### Live Location Integration
- Owners can use their device's current location when adding or editing parking lots
- A "Use Current Location" button automatically populates the latitude and longitude fields
- This feature uses the browser's Geolocation API for accurate positioning

### QR Code Generation
- Owners can generate QR codes for each parking lot
- QR codes can be downloaded and printed for physical display
- Scanning the QR code takes users to the lot's details page

## API Endpoints

### Owner Registration
- `POST /api/owner/register` - Register a new owner profile

### Owner Profile
- `GET /api/owner/profile` - Get owner profile information

### Parking Lot Management
- `GET /api/owner/lots?ownerId={id}` - Get all lots for an owner
- `POST /api/owner/lots` - Create a new parking lot
- `PUT /api/owner/lots/{id}` - Update a specific parking lot
- `DELETE /api/owner/lots/{id}` - Delete a specific parking lot

## Data Format

### Parking Lot Data Structure
Parking lots require specific data fields including geospatial coordinates:

```json
{
  "name": "Downtown Parking",
  "location": "123 Main St, City",
  "locationCoords": {
    "type": "Point",
    "coordinates": [-73.9857, 40.7484] // [longitude, latitude]
  },
  "availableSlots": 10,
  "totalSlots": 20,
  "pricePerHour": 5.50,
  "imageId": "lot-image-123",
  "operatingHours": "24/7",
  "ownerId": "owner-id-123"
}
```

## Testing Owner Functionality

### Automated Testing
Run the owner CRUD test script:
```bash
npm run test:owner-crud
```

Run the owner lots API test script:
```bash
npm run test:owner-lots-api
```

These scripts will:
1. Create a test owner user
2. Create a test owner profile
3. Create a test parking lot
4. Update the parking lot
5. Fetch the parking lot
6. Delete the parking lot
7. Clean up all test data

### Manual Testing

#### 1. Owner Registration
1. Register as a new user with "owner" role
2. Complete the business profile registration
3. Verify redirection to the owner dashboard

#### 2. Parking Lot Management
1. Add a new parking lot:
   - Click "Add Lot" button
   - Fill in lot details
   - Click "Use Current Location" to automatically populate coordinates
   - Submit the form
   - Verify the lot appears in the list

2. Edit a parking lot:
   - Click the edit icon for a lot
   - Modify lot details
   - Click "Use Current Location" to update coordinates
   - Save changes
   - Verify the changes are reflected

3. Delete a parking lot:
   - Click the delete icon for a lot
   - Confirm deletion
   - Verify the lot is removed from the list

4. Generate QR Code:
   - Click the QR code icon for a lot
   - View the generated QR code
   - Download the QR code image

## Common Issues and Solutions

### 1. "Owner profile not found" Error
- **Cause**: User registered as owner but hasn't completed business profile
- **Solution**: Complete the business profile at `/owner/register`

### 2. "Permission denied" Error
- **Cause**: User trying to access lots they don't own
- **Solution**: Verify the user is the owner of the lots they're trying to access

### 3. "Geospatial validation failed" Error
- **Cause**: Missing or incorrect location coordinates when creating a lot
- **Solution**: Ensure locationCoords field has the proper structure with type and coordinates

### 4. "Geolocation not supported" Error
- **Cause**: Browser or device doesn't support Geolocation API
- **Solution**: Manually enter latitude and longitude coordinates

### 5. "User denied Geolocation" Error
- **Cause**: User rejected the location permission request
- **Solution**: Manually enter latitude and longitude coordinates or try again and accept the permission

## Security Considerations

1. Owners can only manage lots they own
2. All API calls require proper authentication
3. Owner profile information is protected
4. Business information is only accessible to the owner

## Future Improvements

1. Add lot images upload functionality
2. Implement lot availability calendar
3. Add revenue reporting and analytics
4. Implement lot reviews and ratings
5. Add multi-location business support
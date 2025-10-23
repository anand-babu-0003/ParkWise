import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ParkingLot from '@/models/ParkingLot';

// GET /api/parking-lots - Get all parking lots with optional location-based filtering
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = parseFloat(searchParams.get('radius') || '5'); // Default 5 km radius
    const search = searchParams.get('search');
    
    let query: any = {};
    
    // If search term is provided, search by name or location
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // If lat/lng are provided, find nearby parking lots
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        // Use geospatial query to find nearby lots
        query.locationCoords = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        };
      }
    }
    
    const parkingLots = await ParkingLot.find(query);
    
    // Convert to plain objects with id
    const result = parkingLots.map(lot => ({
      id: lot._id.toString(),
      name: lot.name,
      location: lot.location,
      availableSlots: lot.availableSlots,
      totalSlots: lot.totalSlots,
      pricePerHour: lot.pricePerHour,
      imageId: lot.imageId,
      operatingHours: lot.operatingHours,
      createdAt: lot.createdAt,
      // Include coordinates if available
      ...(lot.locationCoords && {
        locationCoords: {
          latitude: lot.locationCoords.coordinates[1],
          longitude: lot.locationCoords.coordinates[0]
        }
      })
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get parking lots error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/parking-lots - Create a new parking lot
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    await connectToDatabase();
    
    // If location coordinates are provided, format them correctly
    const parkingLotData = { ...body };
    if (body.latitude && body.longitude) {
      parkingLotData.locationCoords = {
        type: 'Point',
        coordinates: [parseFloat(body.longitude), parseFloat(body.latitude)]
      };
      // Remove individual lat/lng fields
      delete parkingLotData.latitude;
      delete parkingLotData.longitude;
    }
    
    const newParkingLot = new ParkingLot(parkingLotData);
    const savedParkingLot = await newParkingLot.save();
    
    const result = {
      id: savedParkingLot._id.toString(),
      name: savedParkingLot.name,
      location: savedParkingLot.location,
      availableSlots: savedParkingLot.availableSlots,
      totalSlots: savedParkingLot.totalSlots,
      pricePerHour: savedParkingLot.pricePerHour,
      imageId: savedParkingLot.imageId,
      operatingHours: savedParkingLot.operatingHours,
      createdAt: savedParkingLot.createdAt,
      // Include coordinates if available
      ...(savedParkingLot.locationCoords && {
        locationCoords: {
          latitude: savedParkingLot.locationCoords.coordinates[1],
          longitude: savedParkingLot.locationCoords.coordinates[0]
        }
      })
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Create parking lot error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
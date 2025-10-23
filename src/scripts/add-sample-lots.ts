import { connectToDatabase } from '@/lib/db';
import ParkingLot from '@/models/ParkingLot';

async function addSampleParkingLots() {
  try {
    await connectToDatabase();
    
    // Sample parking lots with coordinates
    const sampleLots = [
      {
        name: "Downtown Parking Garage",
        location: "123 Main St, Downtown",
        locationCoords: {
          type: 'Point' as const,
          coordinates: [-73.9857, 40.7484] // [longitude, latitude]
        },
        availableSlots: 45,
        totalSlots: 100,
        pricePerHour: 3.50,
        imageId: "garage1",
        operatingHours: "24/7"
      },
      {
        name: "City Center Plaza",
        location: "456 Central Ave, City Center",
        locationCoords: {
          type: 'Point' as const,
          coordinates: [-73.9928, 40.7589]
        },
        availableSlots: 22,
        totalSlots: 80,
        pricePerHour: 4.00,
        imageId: "plaza1",
        operatingHours: "6AM-10PM"
      },
      {
        name: "Metro Station Parking",
        location: "789 Transit Blvd, Metro Area",
        locationCoords: {
          type: 'Point' as const,
          coordinates: [-73.9712, 40.7831]
        },
        availableSlots: 67,
        totalSlots: 120,
        pricePerHour: 2.75,
        imageId: "metro1",
        operatingHours: "5AM-12AM"
      },
      {
        name: "Shopping Mall Parking",
        location: "321 Retail Dr, Shopping District",
        locationCoords: {
          type: 'Point' as const,
          coordinates: [-73.9635, 40.7614]
        },
        availableSlots: 8,
        totalSlots: 50,
        pricePerHour: 1.50,
        imageId: "mall1",
        operatingHours: "8AM-10PM"
      }
    ];

    // Add each sample lot
    for (const lot of sampleLots) {
      const existingLot = await ParkingLot.findOne({ name: lot.name });
      if (!existingLot) {
        const newLot = new ParkingLot(lot);
        await newLot.save();
        console.log(`Added: ${lot.name}`);
      } else {
        console.log(`Already exists: ${lot.name}`);
      }
    }

    console.log('Sample parking lots added successfully!');
  } catch (error) {
    console.error('Error adding sample parking lots:', error);
  }
}

addSampleParkingLots();
import mongoose, { Schema, Document } from 'mongoose';

export interface IParkingLot extends Document {
  name: string;
  location: string;
  locationCoords: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  imageId: string;
  operatingHours: string;
  ownerId: string; // Reference to the parking lot owner
  createdAt: Date;
  updatedAt: Date;
}

const ParkingLotSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  locationCoords: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere' // Create a geospatial index
    }
  },
  availableSlots: {
    type: Number,
    required: true,
  },
  totalSlots: {
    type: Number,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
  operatingHours: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: false, // Optional for now, can be required later
    index: true, // Index for faster queries
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ParkingLotSchema.pre<IParkingLot>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for geospatial queries
ParkingLotSchema.index({ locationCoords: '2dsphere' });

export default mongoose.models.ParkingLot || mongoose.model<IParkingLot>('ParkingLot', ParkingLotSchema);
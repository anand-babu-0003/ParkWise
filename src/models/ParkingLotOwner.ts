import mongoose, { Schema, Document } from 'mongoose';

export interface IParkingLotOwner extends Document {
  userId: string;
  businessName: string;
  contactInfo: {
    phone: string;
    address: string;
  };
  lots: string[]; // Array of parking lot IDs owned by this owner
  createdAt: Date;
  updatedAt: Date;
}

const ParkingLotOwnerSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true, // Index for faster queries
  },
  businessName: {
    type: String,
    required: true,
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  lots: [{
    type: String,
    ref: 'ParkingLot',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ParkingLotOwnerSchema.pre<IParkingLotOwner>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ParkingLotOwner || mongoose.model<IParkingLotOwner>('ParkingLotOwner', ParkingLotOwnerSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: string;
  lotId: string;
  lotName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  price: number;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  lotId: {
    type: String,
    required: true,
  },
  lotName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Completed', 'Cancelled'],
    default: 'Confirmed',
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
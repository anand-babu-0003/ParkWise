import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  bookingId: string;
  userId: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  bookingId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
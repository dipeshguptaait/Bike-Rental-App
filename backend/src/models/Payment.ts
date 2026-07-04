import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'wallet';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: [true, 'Booking ID is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        paymentMethod: {
            type: String,
            enum: ['credit_card', 'debit_card', 'upi', 'wallet'],
            required: [true, 'Payment method is required'],
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        transactionId: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

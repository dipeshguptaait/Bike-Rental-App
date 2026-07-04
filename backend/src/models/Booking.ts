import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    bikeId: mongoose.Types.ObjectId;
    bookingType: 'hourly' | 'monthly';
    startDate: Date;
    endDate: Date;
    totalCost: number;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    quantity: number;
    paymentId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        bikeId: {
            type: Schema.Types.ObjectId,
            ref: 'Bike',
            required: [true, 'Bike ID is required'],
        },
        bookingType: {
            type: String,
            enum: ['hourly', 'monthly'],
            required: [true, 'Booking type is required'],
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        totalCost: {
            type: Number,
            required: [true, 'Total cost is required'],
            min: [0, 'Total cost cannot be negative'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
            default: 'pending',
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
        },
        paymentId: {
            type: Schema.Types.ObjectId,
            ref: 'Payment',
        },
    },
    {
        timestamps: true,
    }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

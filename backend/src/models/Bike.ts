import mongoose, { Schema, Document } from 'mongoose';

export interface IBike extends Document {
    name: string;
    bikeTypeId: mongoose.Types.ObjectId;
    registrationNumber: string;
    totalQuantity: number;
    availableQuantity: number;
    condition: string;
    location: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const bikeSchema = new Schema<IBike>(
    {
        name: {
            type: String,
            required: [true, 'Bike name is required'],
        },
        bikeTypeId: {
            type: Schema.Types.ObjectId,
            ref: 'BikeType',
            required: [true, 'Bike type is required'],
        },
        registrationNumber: {
            type: String,
            required: [true, 'Registration number is required'],
            unique: true,
        },
        totalQuantity: {
            type: Number,
            required: [true, 'Total quantity is required'],
            min: [1, 'Total quantity must be at least 1'],
        },
        availableQuantity: {
            type: Number,
            required: [true, 'Available quantity is required'],
            min: [0, 'Available quantity cannot be negative'],
        },
        condition: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor'],
            default: 'Good',
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Bike = mongoose.model<IBike>('Bike', bikeSchema);

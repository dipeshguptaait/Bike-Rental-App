import mongoose, { Schema, Document } from 'mongoose';

export interface IBikeType extends Document {
    name: string;
    description: string;
    hourlyRate: number;
    monthlyRate: number;
    createdAt: Date;
    updatedAt: Date;
}

const bikeTypeSchema = new Schema<IBikeType>(
    {
        name: {
            type: String,
            required: [true, 'Bike type name is required'],
            unique: true,
            enum: ['Standard', 'Mountain', 'Electric', 'Road', 'Hybrid'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        hourlyRate: {
            type: Number,
            required: [true, 'Hourly rate is required'],
            min: [0, 'Rate cannot be negative'],
        },
        monthlyRate: {
            type: Number,
            required: [true, 'Monthly rate is required'],
            min: [0, 'Rate cannot be negative'],
        },
    },
    {
        timestamps: true,
    }
);

export const BikeType = mongoose.model<IBikeType>(
    'BikeType',
    bikeTypeSchema
);

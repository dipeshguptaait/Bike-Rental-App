import { Request, Response } from 'express';
import { Booking, Bike, BikeType, User } from '../models/index';
import { ApiError } from '../middleware/errorHandler';
import { IBookingRequest } from '../types/index';
import { calculateBookingCost, isDateValid } from '../utils/validation';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { bikeId, bookingType, startDate, endDate, quantity } =
            req.body as IBookingRequest;

        // Validation
        if (!bikeId || !bookingType || !startDate || !endDate || !quantity) {
            throw new ApiError(400, 'All fields are required');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (!isDateValid(start, end)) {
            throw new ApiError(
                400,
                'Invalid dates. End date must be after start date and start date must be in the future'
            );
        }

        // Check bike exists and has availability
        const bike = await Bike.findById(bikeId).populate('bikeTypeId');
        if (!bike) {
            throw new ApiError(404, 'Bike not found');
        }

        if (!bike.isActive) {
            throw new ApiError(400, 'Bike is not available for booking');
        }

        if (bike.availableQuantity < quantity) {
            throw new ApiError(
                400,
                `Only ${bike.availableQuantity} bikes available, requested ${quantity}`
            );
        }

        // Check for booking conflicts
        const conflictingBooking = await Booking.findOne({
            bikeId,
            status: { $in: ['pending', 'confirmed', 'active'] },
            $or: [
                {
                    startDate: { $lt: end },
                    endDate: { $gt: start },
                },
            ],
        });

        if (conflictingBooking && conflictingBooking.quantity >= bike.availableQuantity) {
            throw new ApiError(400, 'Bike is not available for the selected dates');
        }

        // Calculate cost
        const bikeType = bike.bikeTypeId as any;
        const totalCost = calculateBookingCost(
            bikeType.hourlyRate,
            bikeType.monthlyRate,
            bookingType as 'hourly' | 'monthly',
            start,
            end,
            quantity
        );

        // Create booking
        const booking = new Booking({
            userId: req.user.userId,
            bikeId,
            bookingType,
            startDate: start,
            endDate: end,
            quantity,
            totalCost,
            status: 'pending',
        });

        await booking.save();
        await booking.populate('userId');
        await booking.populate('bikeId');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully. Please proceed with payment.',
            data: booking,
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error creating booking',
                error: error.message,
            });
        }
    }
};

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { status } = req.query;

        const filter: any = { userId: req.user.userId };
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('bikeId')
            .populate('userId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'User bookings retrieved successfully',
            data: bookings,
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error retrieving bookings',
                error: error.message,
            });
        }
    }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('bikeId')
            .populate('userId');

        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        // Check if user owns this booking
        if (booking.userId.toString() !== req.user.userId) {
            throw new ApiError(403, 'Unauthorized to view this booking');
        }

        res.status(200).json({
            success: true,
            message: 'Booking retrieved successfully',
            data: booking,
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error retrieving booking',
                error: error.message,
            });
        }
    }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        if ((booking.userId as any).toString() !== req.user.userId) {
            throw new ApiError(403, 'Unauthorized to cancel this booking');
        }

        if (booking.status === 'cancelled' || booking.status === 'completed') {
            throw new ApiError(400, `Cannot cancel a ${booking.status} booking`);
        }

        // Update bike availability
        const bike = await Bike.findById(booking.bikeId);
        if (bike) {
            bike.availableQuantity += booking.quantity;
            await bike.save();
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking,
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error cancelling booking',
                error: error.message,
            });
        }
    }
};

export const completBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        if (booking.status !== 'active') {
            throw new ApiError(400, 'Only active bookings can be completed');
        }

        booking.status = 'completed';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking completed successfully',
            data: booking,
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error completing booking',
                error: error.message,
            });
        }
    }
};

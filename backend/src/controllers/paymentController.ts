import { Request, Response } from 'express';
import { Payment, Booking, Bike } from '../models/index';
import { ApiError } from '../middleware/errorHandler';
import { IPaymentRequest } from '../types/index';
import { generateTransactionId } from '../utils/validation';

export const processPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { bookingId, amount, paymentMethod } = req.body as IPaymentRequest;

        if (!bookingId || !amount || !paymentMethod) {
            throw new ApiError(400, 'All fields are required');
        }

        if (amount <= 0) {
            throw new ApiError(400, 'Amount must be greater than 0');
        }

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        if (booking.userId.toString() !== req.user.userId) {
            throw new ApiError(403, 'Unauthorized to pay for this booking');
        }

        if (booking.status !== 'pending') {
            throw new ApiError(400, 'Booking is not in pending status');
        }

        // Verify payment amount
        if (amount !== booking.totalCost) {
            throw new ApiError(
                400,
                `Payment amount must be ${booking.totalCost}, received ${amount}`
            );
        }

        // Create payment record (Mock payment processing)
        const payment = new Payment({
            userId: req.user.userId,
            bookingId,
            amount,
            paymentMethod,
            paymentStatus: 'completed',
            transactionId: generateTransactionId(),
            description: `Payment for bike booking`,
        });

        await payment.save();

        // Update booking status
        booking.status = 'confirmed';
        booking.paymentId = payment._id;
        await booking.save();

        // Update bike availability
        const bike = await Bike.findById(booking.bikeId);
        if (bike) {
            bike.availableQuantity -= booking.quantity;
            await bike.save();
        }

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            data: {
                payment,
                booking,
            },
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
                message: 'Error processing payment',
                error: error.message,
            });
        }
    }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { id } = req.params;

        const payment = await Payment.findById(id);
        if (!payment) {
            throw new ApiError(404, 'Payment not found');
        }

        if (payment.userId.toString() !== req.user.userId) {
            throw new ApiError(403, 'Unauthorized to view this payment');
        }

        res.status(200).json({
            success: true,
            message: 'Payment retrieved successfully',
            data: payment,
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
                message: 'Error retrieving payment',
                error: error.message,
            });
        }
    }
};

export const getUserPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { status } = req.query;

        const filter: any = { userId: req.user.userId };
        if (status) filter.paymentStatus = status;

        const payments = await Payment.find(filter)
            .populate('bookingId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'User payments retrieved successfully',
            data: payments,
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
                message: 'Error retrieving payments',
                error: error.message,
            });
        }
    }
};

export const refundPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            throw new ApiError(404, 'Payment not found');
        }

        if (payment.userId.toString() !== req.user.userId) {
            throw new ApiError(403, 'Unauthorized to refund this payment');
        }

        if (payment.paymentStatus === 'refunded') {
            throw new ApiError(400, 'Payment already refunded');
        }

        if (payment.paymentStatus !== 'completed') {
            throw new ApiError(400, 'Only completed payments can be refunded');
        }

        // Update payment status
        payment.paymentStatus = 'refunded';
        await payment.save();

        // Get booking and update status
        const booking = await Booking.findById(payment.bookingId);
        if (booking) {
            booking.status = 'cancelled';
            await booking.save();

            // Update bike availability
            const bike = await Bike.findById(booking.bikeId);
            if (bike) {
                bike.availableQuantity += booking.quantity;
                await bike.save();
            }
        }

        res.status(200).json({
            success: true,
            message: 'Payment refunded successfully',
            data: payment,
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
                message: 'Error refunding payment',
                error: error.message,
            });
        }
    }
};

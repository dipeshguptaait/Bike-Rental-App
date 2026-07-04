"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPayment = exports.getUserPayments = exports.getPaymentById = exports.processPayment = void 0;
const index_1 = require("../models/index");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../utils/validation");
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { bookingId, amount, paymentMethod } = req.body;
        if (!bookingId || !amount || !paymentMethod) {
            throw new errorHandler_1.ApiError(400, 'All fields are required');
        }
        if (amount <= 0) {
            throw new errorHandler_1.ApiError(400, 'Amount must be greater than 0');
        }
        // Find booking
        const booking = yield index_1.Booking.findById(bookingId);
        if (!booking) {
            throw new errorHandler_1.ApiError(404, 'Booking not found');
        }
        if (booking.userId.toString() !== req.user.userId) {
            throw new errorHandler_1.ApiError(403, 'Unauthorized to pay for this booking');
        }
        if (booking.status !== 'pending') {
            throw new errorHandler_1.ApiError(400, 'Booking is not in pending status');
        }
        // Verify payment amount
        if (amount !== booking.totalCost) {
            throw new errorHandler_1.ApiError(400, `Payment amount must be ${booking.totalCost}, received ${amount}`);
        }
        // Create payment record (Mock payment processing)
        const payment = new index_1.Payment({
            userId: req.user.userId,
            bookingId,
            amount,
            paymentMethod,
            paymentStatus: 'completed',
            transactionId: (0, validation_1.generateTransactionId)(),
            description: `Payment for bike booking`,
        });
        yield payment.save();
        // Update booking status
        booking.status = 'confirmed';
        booking.paymentId = payment._id;
        yield booking.save();
        // Update bike availability
        const bike = yield index_1.Bike.findById(booking.bikeId);
        if (bike) {
            bike.availableQuantity -= booking.quantity;
            yield bike.save();
        }
        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            data: {
                payment,
                booking,
            },
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error processing payment',
                error: error.message,
            });
        }
    }
});
exports.processPayment = processPayment;
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { id } = req.params;
        const payment = yield index_1.Payment.findById(id);
        if (!payment) {
            throw new errorHandler_1.ApiError(404, 'Payment not found');
        }
        if (payment.userId.toString() !== req.user.userId) {
            throw new errorHandler_1.ApiError(403, 'Unauthorized to view this payment');
        }
        res.status(200).json({
            success: true,
            message: 'Payment retrieved successfully',
            data: payment,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payment',
                error: error.message,
            });
        }
    }
});
exports.getPaymentById = getPaymentById;
const getUserPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { status } = req.query;
        const filter = { userId: req.user.userId };
        if (status)
            filter.paymentStatus = status;
        const payments = yield index_1.Payment.find(filter)
            .populate('bookingId')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'User payments retrieved successfully',
            data: payments,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payments',
                error: error.message,
            });
        }
    }
});
exports.getUserPayments = getUserPayments;
const refundPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { paymentId } = req.params;
        const payment = yield index_1.Payment.findById(paymentId);
        if (!payment) {
            throw new errorHandler_1.ApiError(404, 'Payment not found');
        }
        if (payment.userId.toString() !== req.user.userId) {
            throw new errorHandler_1.ApiError(403, 'Unauthorized to refund this payment');
        }
        if (payment.paymentStatus === 'refunded') {
            throw new errorHandler_1.ApiError(400, 'Payment already refunded');
        }
        if (payment.paymentStatus !== 'completed') {
            throw new errorHandler_1.ApiError(400, 'Only completed payments can be refunded');
        }
        // Update payment status
        payment.paymentStatus = 'refunded';
        yield payment.save();
        // Get booking and update status
        const booking = yield index_1.Booking.findById(payment.bookingId);
        if (booking) {
            booking.status = 'cancelled';
            yield booking.save();
            // Update bike availability
            const bike = yield index_1.Bike.findById(booking.bikeId);
            if (bike) {
                bike.availableQuantity += booking.quantity;
                yield bike.save();
            }
        }
        res.status(200).json({
            success: true,
            message: 'Payment refunded successfully',
            data: payment,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error refunding payment',
                error: error.message,
            });
        }
    }
});
exports.refundPayment = refundPayment;

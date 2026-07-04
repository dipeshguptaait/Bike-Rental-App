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
exports.completBooking = exports.cancelBooking = exports.getBookingById = exports.getUserBookings = exports.createBooking = void 0;
const index_1 = require("../models/index");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../utils/validation");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { bikeId, bookingType, startDate, endDate, quantity } = req.body;
        // Validation
        if (!bikeId || !bookingType || !startDate || !endDate || !quantity) {
            throw new errorHandler_1.ApiError(400, 'All fields are required');
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!(0, validation_1.isDateValid)(start, end)) {
            throw new errorHandler_1.ApiError(400, 'Invalid dates. End date must be after start date and start date must be in the future');
        }
        // Check bike exists and has availability
        const bike = yield index_1.Bike.findById(bikeId).populate('bikeTypeId');
        if (!bike) {
            throw new errorHandler_1.ApiError(404, 'Bike not found');
        }
        if (!bike.isActive) {
            throw new errorHandler_1.ApiError(400, 'Bike is not available for booking');
        }
        if (bike.availableQuantity < quantity) {
            throw new errorHandler_1.ApiError(400, `Only ${bike.availableQuantity} bikes available, requested ${quantity}`);
        }
        // Check for booking conflicts
        const conflictingBooking = yield index_1.Booking.findOne({
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
            throw new errorHandler_1.ApiError(400, 'Bike is not available for the selected dates');
        }
        // Calculate cost
        const bikeType = bike.bikeTypeId;
        const totalCost = (0, validation_1.calculateBookingCost)(bikeType.hourlyRate, bikeType.monthlyRate, bookingType, start, end, quantity);
        // Create booking
        const booking = new index_1.Booking({
            userId: req.user.userId,
            bikeId,
            bookingType,
            startDate: start,
            endDate: end,
            quantity,
            totalCost,
            status: 'pending',
        });
        yield booking.save();
        yield booking.populate('userId');
        yield booking.populate('bikeId');
        res.status(201).json({
            success: true,
            message: 'Booking created successfully. Please proceed with payment.',
            data: booking,
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
                message: 'Error creating booking',
                error: error.message,
            });
        }
    }
});
exports.createBooking = createBooking;
const getUserBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { status } = req.query;
        const filter = { userId: req.user.userId };
        if (status)
            filter.status = status;
        const bookings = yield index_1.Booking.find(filter)
            .populate('bikeId')
            .populate('userId')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'User bookings retrieved successfully',
            data: bookings,
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
                message: 'Error retrieving bookings',
                error: error.message,
            });
        }
    }
});
exports.getUserBookings = getUserBookings;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { id } = req.params;
        const booking = yield index_1.Booking.findById(id)
            .populate('bikeId')
            .populate('userId');
        if (!booking) {
            throw new errorHandler_1.ApiError(404, 'Booking not found');
        }
        // Check if user owns this booking
        if (booking.userId.toString() !== req.user.userId) {
            throw new errorHandler_1.ApiError(403, 'Unauthorized to view this booking');
        }
        res.status(200).json({
            success: true,
            message: 'Booking retrieved successfully',
            data: booking,
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
                message: 'Error retrieving booking',
                error: error.message,
            });
        }
    }
});
exports.getBookingById = getBookingById;
const cancelBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { id } = req.params;
        const booking = yield index_1.Booking.findById(id);
        if (!booking) {
            throw new errorHandler_1.ApiError(404, 'Booking not found');
        }
        if (booking.userId.toString() !== req.user.userId) {
            throw new errorHandler_1.ApiError(403, 'Unauthorized to cancel this booking');
        }
        if (booking.status === 'cancelled' || booking.status === 'completed') {
            throw new errorHandler_1.ApiError(400, `Cannot cancel a ${booking.status} booking`);
        }
        // Update bike availability
        const bike = yield index_1.Bike.findById(booking.bikeId);
        if (bike) {
            bike.availableQuantity += booking.quantity;
            yield bike.save();
        }
        booking.status = 'cancelled';
        yield booking.save();
        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking,
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
                message: 'Error cancelling booking',
                error: error.message,
            });
        }
    }
});
exports.cancelBooking = cancelBooking;
const completBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { id } = req.params;
        const booking = yield index_1.Booking.findById(id);
        if (!booking) {
            throw new errorHandler_1.ApiError(404, 'Booking not found');
        }
        if (booking.status !== 'active') {
            throw new errorHandler_1.ApiError(400, 'Only active bookings can be completed');
        }
        booking.status = 'completed';
        yield booking.save();
        res.status(200).json({
            success: true,
            message: 'Booking completed successfully',
            data: booking,
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
                message: 'Error completing booking',
                error: error.message,
            });
        }
    }
});
exports.completBooking = completBooking;

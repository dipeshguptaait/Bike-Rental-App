import express from 'express';
import {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking,
    completBooking,
} from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All booking routes require authentication
router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getUserBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id/cancel', authMiddleware, cancelBooking);
router.put('/:id/complete', authMiddleware, completBooking);

export default router;

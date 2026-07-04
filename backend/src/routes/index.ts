import express from 'express';
import authRoutes from './authRoutes';
import bikeTypeRoutes from './bikeTypeRoutes';
import bikeRoutes from './bikeRoutes';
import bookingRoutes from './bookingRoutes';
import paymentRoutes from './paymentRoutes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bike Rental Service API is running',
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/bike-types', bikeTypeRoutes);
router.use('/bikes', bikeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

export default router;
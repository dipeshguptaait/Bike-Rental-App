import express from 'express';
import {
    createBike,
    getAllBikes,
    getBikeById,
    updateBike,
    deleteBike,
    getAvailableBikes,
} from '../controllers/bikeController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllBikes);
router.get('/available/all', getAvailableBikes);
router.get('/:id', getBikeById);

// Protected routes (admin only in real app)
router.post('/', authMiddleware, createBike);
router.put('/:id', authMiddleware, updateBike);
router.delete('/:id', authMiddleware, deleteBike);

export default router;

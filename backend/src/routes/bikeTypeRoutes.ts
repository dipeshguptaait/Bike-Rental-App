import express from 'express';
import {
    createBikeType,
    getAllBikeTypes,
    getBikeTypeById,
    updateBikeType,
    deleteBikeType,
} from '../controllers/bikeTypeController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllBikeTypes);
router.get('/:id', getBikeTypeById);

// Protected routes (admin only in real app)
router.post('/', authMiddleware, createBikeType);
router.put('/:id', authMiddleware, updateBikeType);
router.delete('/:id', authMiddleware, deleteBikeType);

export default router;

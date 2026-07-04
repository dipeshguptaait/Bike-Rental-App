import express from 'express';
import {
    processPayment,
    getPaymentById,
    getUserPayments,
    refundPayment,
} from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All payment routes require authentication
router.post('/', authMiddleware, processPayment);
router.get('/', authMiddleware, getUserPayments);
router.get('/:id', authMiddleware, getPaymentById);
router.post('/:paymentId/refund', authMiddleware, refundPayment);

export default router;

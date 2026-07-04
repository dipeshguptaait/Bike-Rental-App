"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All payment routes require authentication
router.post('/', auth_1.authMiddleware, paymentController_1.processPayment);
router.get('/', auth_1.authMiddleware, paymentController_1.getUserPayments);
router.get('/:id', auth_1.authMiddleware, paymentController_1.getPaymentById);
router.post('/:paymentId/refund', auth_1.authMiddleware, paymentController_1.refundPayment);
exports.default = router;

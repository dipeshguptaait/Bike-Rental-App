"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const bikeTypeRoutes_1 = __importDefault(require("./bikeTypeRoutes"));
const bikeRoutes_1 = __importDefault(require("./bikeRoutes"));
const bookingRoutes_1 = __importDefault(require("./bookingRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const router = express_1.default.Router();
// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bike Rental Service API is running',
    });
});
// Mount routes
router.use('/auth', authRoutes_1.default);
router.use('/bike-types', bikeTypeRoutes_1.default);
router.use('/bikes', bikeRoutes_1.default);
router.use('/bookings', bookingRoutes_1.default);
router.use('/payments', paymentRoutes_1.default);
exports.default = router;

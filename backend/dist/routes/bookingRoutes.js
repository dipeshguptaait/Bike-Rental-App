"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All booking routes require authentication
router.post('/', auth_1.authMiddleware, bookingController_1.createBooking);
router.get('/', auth_1.authMiddleware, bookingController_1.getUserBookings);
router.get('/:id', auth_1.authMiddleware, bookingController_1.getBookingById);
router.put('/:id/cancel', auth_1.authMiddleware, bookingController_1.cancelBooking);
router.put('/:id/complete', auth_1.authMiddleware, bookingController_1.completBooking);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bikeController_1 = require("../controllers/bikeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get('/', bikeController_1.getAllBikes);
router.get('/available/all', bikeController_1.getAvailableBikes);
router.get('/:id', bikeController_1.getBikeById);
// Protected routes (admin only in real app)
router.post('/', auth_1.authMiddleware, bikeController_1.createBike);
router.put('/:id', auth_1.authMiddleware, bikeController_1.updateBike);
router.delete('/:id', auth_1.authMiddleware, bikeController_1.deleteBike);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bikeTypeController_1 = require("../controllers/bikeTypeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get('/', bikeTypeController_1.getAllBikeTypes);
router.get('/:id', bikeTypeController_1.getBikeTypeById);
// Protected routes (admin only in real app)
router.post('/', auth_1.authMiddleware, bikeTypeController_1.createBikeType);
router.put('/:id', auth_1.authMiddleware, bikeTypeController_1.updateBikeType);
router.delete('/:id', auth_1.authMiddleware, bikeTypeController_1.deleteBikeType);
exports.default = router;

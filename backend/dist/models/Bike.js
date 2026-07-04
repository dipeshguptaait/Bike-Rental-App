"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bike = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bikeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Bike name is required'],
    },
    bikeTypeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'BikeType',
        required: [true, 'Bike type is required'],
    },
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true,
    },
    totalQuantity: {
        type: Number,
        required: [true, 'Total quantity is required'],
        min: [1, 'Total quantity must be at least 1'],
    },
    availableQuantity: {
        type: Number,
        required: [true, 'Available quantity is required'],
        min: [0, 'Available quantity cannot be negative'],
    },
    condition: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor'],
        default: 'Good',
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
exports.Bike = mongoose_1.default.model('Bike', bikeSchema);

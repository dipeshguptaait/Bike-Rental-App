"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableBikes = exports.deleteBike = exports.updateBike = exports.getBikeById = exports.getAllBikes = exports.createBike = void 0;
const index_1 = require("../models/index");
const errorHandler_1 = require("../middleware/errorHandler");
const createBike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, bikeTypeId, registrationNumber, totalQuantity, condition, location, } = req.body;
        if (!name ||
            !bikeTypeId ||
            !registrationNumber ||
            !totalQuantity ||
            !location) {
            throw new errorHandler_1.ApiError(400, 'All required fields must be provided');
        }
        if (totalQuantity < 1) {
            throw new errorHandler_1.ApiError(400, 'Total quantity must be at least 1');
        }
        const bike = new index_1.Bike({
            name,
            bikeTypeId,
            registrationNumber,
            totalQuantity,
            availableQuantity: totalQuantity,
            condition: condition || 'Good',
            location,
        });
        yield bike.save();
        yield bike.populate('bikeTypeId');
        res.status(201).json({
            success: true,
            message: 'Bike created successfully',
            data: bike,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error creating bike',
                error: error.message,
            });
        }
    }
});
exports.createBike = createBike;
const getAllBikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bikeTypeId, location, isActive } = req.query;
        const filter = {};
        if (bikeTypeId)
            filter.bikeTypeId = bikeTypeId;
        if (location)
            filter.location = { $regex: location, $options: 'i' };
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        const bikes = yield index_1.Bike.find(filter).populate('bikeTypeId');
        res.status(200).json({
            success: true,
            message: 'Bikes retrieved successfully',
            data: bikes,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving bikes',
            error: error.message,
        });
    }
});
exports.getAllBikes = getAllBikes;
const getBikeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bike = yield index_1.Bike.findById(id).populate('bikeTypeId');
        if (!bike) {
            throw new errorHandler_1.ApiError(404, 'Bike not found');
        }
        res.status(200).json({
            success: true,
            message: 'Bike retrieved successfully',
            data: bike,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error retrieving bike',
                error: error.message,
            });
        }
    }
});
exports.getBikeById = getBikeById;
const updateBike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, registrationNumber, totalQuantity, availableQuantity, condition, location, isActive, } = req.body;
        const bike = yield index_1.Bike.findById(id);
        if (!bike) {
            throw new errorHandler_1.ApiError(404, 'Bike not found');
        }
        if (name)
            bike.name = name;
        if (registrationNumber)
            bike.registrationNumber = registrationNumber;
        if (totalQuantity)
            bike.totalQuantity = totalQuantity;
        if (availableQuantity !== undefined)
            bike.availableQuantity = availableQuantity;
        if (condition)
            bike.condition = condition;
        if (location)
            bike.location = location;
        if (isActive !== undefined)
            bike.isActive = isActive;
        yield bike.save();
        yield bike.populate('bikeTypeId');
        res.status(200).json({
            success: true,
            message: 'Bike updated successfully',
            data: bike,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error updating bike',
                error: error.message,
            });
        }
    }
});
exports.updateBike = updateBike;
const deleteBike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bike = yield index_1.Bike.findByIdAndDelete(id);
        if (!bike) {
            throw new errorHandler_1.ApiError(404, 'Bike not found');
        }
        res.status(200).json({
            success: true,
            message: 'Bike deleted successfully',
            data: bike,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error deleting bike',
                error: error.message,
            });
        }
    }
});
exports.deleteBike = deleteBike;
const getAvailableBikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bikes = yield index_1.Bike.find({ isActive: true, availableQuantity: { $gt: 0 } }).populate('bikeTypeId');
        res.status(200).json({
            success: true,
            message: 'Available bikes retrieved successfully',
            data: bikes,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving available bikes',
            error: error.message,
        });
    }
});
exports.getAvailableBikes = getAvailableBikes;

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
exports.deleteBikeType = exports.updateBikeType = exports.getBikeTypeById = exports.getAllBikeTypes = exports.createBikeType = void 0;
const index_1 = require("../models/index");
const errorHandler_1 = require("../middleware/errorHandler");
const createBikeType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, hourlyRate, monthlyRate } = req.body;
        if (!name || !description || hourlyRate === undefined || monthlyRate === undefined) {
            throw new errorHandler_1.ApiError(400, 'All fields are required');
        }
        if (hourlyRate < 0 || monthlyRate < 0) {
            throw new errorHandler_1.ApiError(400, 'Rates cannot be negative');
        }
        const bikeType = new index_1.BikeType({
            name,
            description,
            hourlyRate,
            monthlyRate,
        });
        yield bikeType.save();
        res.status(201).json({
            success: true,
            message: 'Bike type created successfully',
            data: bikeType,
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
                message: 'Error creating bike type',
                error: error.message,
            });
        }
    }
});
exports.createBikeType = createBikeType;
const getAllBikeTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bikeTypes = yield index_1.BikeType.find();
        res.status(200).json({
            success: true,
            message: 'Bike types retrieved successfully',
            data: bikeTypes,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving bike types',
            error: error.message,
        });
    }
});
exports.getAllBikeTypes = getAllBikeTypes;
const getBikeTypeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bikeType = yield index_1.BikeType.findById(id);
        if (!bikeType) {
            throw new errorHandler_1.ApiError(404, 'Bike type not found');
        }
        res.status(200).json({
            success: true,
            message: 'Bike type retrieved successfully',
            data: bikeType,
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
                message: 'Error retrieving bike type',
                error: error.message,
            });
        }
    }
});
exports.getBikeTypeById = getBikeTypeById;
const updateBikeType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, hourlyRate, monthlyRate } = req.body;
        const bikeType = yield index_1.BikeType.findById(id);
        if (!bikeType) {
            throw new errorHandler_1.ApiError(404, 'Bike type not found');
        }
        if (name)
            bikeType.name = name;
        if (description)
            bikeType.description = description;
        if (hourlyRate !== undefined)
            bikeType.hourlyRate = hourlyRate;
        if (monthlyRate !== undefined)
            bikeType.monthlyRate = monthlyRate;
        yield bikeType.save();
        res.status(200).json({
            success: true,
            message: 'Bike type updated successfully',
            data: bikeType,
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
                message: 'Error updating bike type',
                error: error.message,
            });
        }
    }
});
exports.updateBikeType = updateBikeType;
const deleteBikeType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bikeType = yield index_1.BikeType.findByIdAndDelete(id);
        if (!bikeType) {
            throw new errorHandler_1.ApiError(404, 'Bike type not found');
        }
        res.status(200).json({
            success: true,
            message: 'Bike type deleted successfully',
            data: bikeType,
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
                message: 'Error deleting bike type',
                error: error.message,
            });
        }
    }
});
exports.deleteBikeType = deleteBikeType;

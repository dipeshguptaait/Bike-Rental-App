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
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const index_1 = require("../models/index");
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../utils/validation");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, password, address } = req.body;
        // Validation
        if (!name || !email || !phone || !password || !address) {
            throw new errorHandler_1.ApiError(400, 'All fields are required');
        }
        if (!(0, validation_1.isValidEmail)(email)) {
            throw new errorHandler_1.ApiError(400, 'Invalid email format');
        }
        if (!(0, validation_1.isValidPhone)(phone)) {
            throw new errorHandler_1.ApiError(400, 'Invalid phone number');
        }
        if (password.length < 6) {
            throw new errorHandler_1.ApiError(400, 'Password must be at least 6 characters');
        }
        // Check if user already exists
        const existingUser = yield index_1.User.findOne({ email });
        if (existingUser) {
            throw new errorHandler_1.ApiError(400, 'User with this email already exists');
        }
        // Create new user
        const user = new index_1.User({
            name,
            email,
            phone,
            password,
            address,
        });
        yield user.save();
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                },
            },
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
                message: 'Error registering user',
                error: error.message,
            });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            throw new errorHandler_1.ApiError(400, 'Email and password are required');
        }
        // Find user
        const user = yield index_1.User.findOne({ email }).select('+password');
        if (!user) {
            throw new errorHandler_1.ApiError(401, 'Invalid email or password');
        }
        // Compare password
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            throw new errorHandler_1.ApiError(401, 'Invalid email or password');
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                },
            },
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
                message: 'Error logging in',
                error: error.message,
            });
        }
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const user = yield index_1.User.findById(req.user.userId);
        if (!user) {
            throw new errorHandler_1.ApiError(404, 'User not found');
        }
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
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
                message: 'Error retrieving profile',
                error: error.message,
            });
        }
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new errorHandler_1.ApiError(401, 'Not authenticated');
        }
        const { name, phone, address } = req.body;
        const user = yield index_1.User.findById(req.user.userId);
        if (!user) {
            throw new errorHandler_1.ApiError(404, 'User not found');
        }
        // Update fields
        if (name)
            user.name = name;
        if (phone) {
            if (!(0, validation_1.isValidPhone)(phone)) {
                throw new errorHandler_1.ApiError(400, 'Invalid phone number');
            }
            user.phone = phone;
        }
        if (address)
            user.address = address;
        yield user.save();
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
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
                message: 'Error updating profile',
                error: error.message,
            });
        }
    }
});
exports.updateProfile = updateProfile;

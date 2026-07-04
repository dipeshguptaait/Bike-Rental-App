import { Request, Response } from 'express';
import { User } from '../models/index';
import { generateToken } from '../utils/jwt';
import { IRegisterRequest, ILoginRequest } from '../types/index';
import { ApiError } from '../middleware/errorHandler';
import { isValidEmail, isValidPhone } from '../utils/validation';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, password, address } = req.body as IRegisterRequest;

        // Validation
        if (!name || !email || !phone || !password || !address) {
            throw new ApiError(400, 'All fields are required');
        }

        if (!isValidEmail(email)) {
            throw new ApiError(400, 'Invalid email format');
        }

        if (!isValidPhone(phone)) {
            throw new ApiError(400, 'Invalid phone number');
        }

        if (password.length < 6) {
            throw new ApiError(400, 'Password must be at least 6 characters');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, 'User with this email already exists');
        }

        // Create new user
        const user = new User({
            name,
            email,
            phone,
            password,
            address,
        });

        await user.save();

        // Generate token
        const token = generateToken({
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
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error registering user',
                error: error.message,
            });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as ILoginRequest;

        // Validation
        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        // Generate token
        const token = generateToken({
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
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error logging in',
                error: error.message,
            });
        }
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
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
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error retrieving profile',
                error: error.message,
            });
        }
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const { name, phone, address } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Update fields
        if (name) user.name = name;
        if (phone) {
            if (!isValidPhone(phone)) {
                throw new ApiError(400, 'Invalid phone number');
            }
            user.phone = phone;
        }
        if (address) user.address = address;

        await user.save();

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
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.details || error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error updating profile',
                error: error.message,
            });
        }
    }
};

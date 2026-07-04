import { Request, Response } from 'express';
import { BikeType } from '../models/index';
import { ApiError } from '../middleware/errorHandler';

export const createBikeType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, hourlyRate, monthlyRate } = req.body;

        if (!name || !description || hourlyRate === undefined || monthlyRate === undefined) {
            throw new ApiError(400, 'All fields are required');
        }

        if (hourlyRate < 0 || monthlyRate < 0) {
            throw new ApiError(400, 'Rates cannot be negative');
        }

        const bikeType = new BikeType({
            name,
            description,
            hourlyRate,
            monthlyRate,
        });

        await bikeType.save();

        res.status(201).json({
            success: true,
            message: 'Bike type created successfully',
            data: bikeType,
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
                message: 'Error creating bike type',
                error: error.message,
            });
        }
    }
};

export const getAllBikeTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        const bikeTypes = await BikeType.find();

        res.status(200).json({
            success: true,
            message: 'Bike types retrieved successfully',
            data: bikeTypes,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving bike types',
            error: error.message,
        });
    }
};

export const getBikeTypeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const bikeType = await BikeType.findById(id);
        if (!bikeType) {
            throw new ApiError(404, 'Bike type not found');
        }

        res.status(200).json({
            success: true,
            message: 'Bike type retrieved successfully',
            data: bikeType,
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
                message: 'Error retrieving bike type',
                error: error.message,
            });
        }
    }
};

export const updateBikeType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, hourlyRate, monthlyRate } = req.body;

        const bikeType = await BikeType.findById(id);
        if (!bikeType) {
            throw new ApiError(404, 'Bike type not found');
        }

        if (name) bikeType.name = name;
        if (description) bikeType.description = description;
        if (hourlyRate !== undefined) bikeType.hourlyRate = hourlyRate;
        if (monthlyRate !== undefined) bikeType.monthlyRate = monthlyRate;

        await bikeType.save();

        res.status(200).json({
            success: true,
            message: 'Bike type updated successfully',
            data: bikeType,
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
                message: 'Error updating bike type',
                error: error.message,
            });
        }
    }
};

export const deleteBikeType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const bikeType = await BikeType.findByIdAndDelete(id);
        if (!bikeType) {
            throw new ApiError(404, 'Bike type not found');
        }

        res.status(200).json({
            success: true,
            message: 'Bike type deleted successfully',
            data: bikeType,
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
                message: 'Error deleting bike type',
                error: error.message,
            });
        }
    }
};

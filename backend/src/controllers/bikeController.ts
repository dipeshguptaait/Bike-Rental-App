import { Request, Response } from 'express';
import { Bike } from '../models/index';
import { ApiError } from '../middleware/errorHandler';

export const createBike = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            bikeTypeId,
            registrationNumber,
            totalQuantity,
            condition,
            location,
        } = req.body;

        if (
            !name ||
            !bikeTypeId ||
            !registrationNumber ||
            !totalQuantity ||
            !location
        ) {
            throw new ApiError(400, 'All required fields must be provided');
        }

        if (totalQuantity < 1) {
            throw new ApiError(400, 'Total quantity must be at least 1');
        }

        const bike = new Bike({
            name,
            bikeTypeId,
            registrationNumber,
            totalQuantity,
            availableQuantity: totalQuantity,
            condition: condition || 'Good',
            location,
        });

        await bike.save();
        await bike.populate('bikeTypeId');

        res.status(201).json({
            success: true,
            message: 'Bike created successfully',
            data: bike,
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
                message: 'Error creating bike',
                error: error.message,
            });
        }
    }
};

export const getAllBikes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bikeTypeId, location, isActive } = req.query;

        const filter: any = {};
        if (bikeTypeId) filter.bikeTypeId = bikeTypeId;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const bikes = await Bike.find(filter).populate('bikeTypeId');

        res.status(200).json({
            success: true,
            message: 'Bikes retrieved successfully',
            data: bikes,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving bikes',
            error: error.message,
        });
    }
};

export const getBikeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const bike = await Bike.findById(id).populate('bikeTypeId');
        if (!bike) {
            throw new ApiError(404, 'Bike not found');
        }

        res.status(200).json({
            success: true,
            message: 'Bike retrieved successfully',
            data: bike,
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
                message: 'Error retrieving bike',
                error: error.message,
            });
        }
    }
};

export const updateBike = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            name,
            registrationNumber,
            totalQuantity,
            availableQuantity,
            condition,
            location,
            isActive,
        } = req.body;

        const bike = await Bike.findById(id);
        if (!bike) {
            throw new ApiError(404, 'Bike not found');
        }

        if (name) bike.name = name;
        if (registrationNumber) bike.registrationNumber = registrationNumber;
        if (totalQuantity) bike.totalQuantity = totalQuantity;
        if (availableQuantity !== undefined)
            bike.availableQuantity = availableQuantity;
        if (condition) bike.condition = condition;
        if (location) bike.location = location;
        if (isActive !== undefined) bike.isActive = isActive;

        await bike.save();
        await bike.populate('bikeTypeId');

        res.status(200).json({
            success: true,
            message: 'Bike updated successfully',
            data: bike,
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
                message: 'Error updating bike',
                error: error.message,
            });
        }
    }
};

export const deleteBike = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const bike = await Bike.findByIdAndDelete(id);
        if (!bike) {
            throw new ApiError(404, 'Bike not found');
        }

        res.status(200).json({
            success: true,
            message: 'Bike deleted successfully',
            data: bike,
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
                message: 'Error deleting bike',
                error: error.message,
            });
        }
    }
};

export const getAvailableBikes = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const bikes = await Bike.find({ isActive: true, availableQuantity: { $gt: 0 } }).populate(
            'bikeTypeId'
        );

        res.status(200).json({
            success: true,
            message: 'Available bikes retrieved successfully',
            data: bikes,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving available bikes',
            error: error.message,
        });
    }
};

import { Request, Response, NextFunction } from 'express';
import { IApiResponse } from '../types/index';

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: any
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.details || err.message,
        });
        return;
    }

    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: err.message,
        });
        return;
    }

    // Handle MongoDB duplicate key errors
    if ((err as any).code === 11000) {
        res.status(400).json({
            success: false,
            message: 'Duplicate field value',
            error: `${Object.keys((err as any).keyPattern)[0]} already exists`,
        });
        return;
    }

    // Generic error handler
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
};

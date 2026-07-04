"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
const errorHandler = (err, req, res, next) => {
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
    if (err.code === 11000) {
        res.status(400).json({
            success: false,
            message: 'Duplicate field value',
            error: `${Object.keys(err.keyPattern)[0]} already exists`,
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
exports.errorHandler = errorHandler;

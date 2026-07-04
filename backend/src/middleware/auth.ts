import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { IJWTPayload } from '../types/index';

// Extend Express Request to include user data
declare global {
    namespace Express {
        interface Request {
            user?: IJWTPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided',
                error: 'Authorization token is missing',
            });
            return;
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message,
        });
    }
};

export const optionalAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = verifyToken(token);
            req.user = decoded;
        }
        next();
    } catch (error) {
        // If token is invalid, continue without user
        next();
    }
};

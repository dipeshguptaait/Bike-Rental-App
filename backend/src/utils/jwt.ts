import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../types/index';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export const generateToken = (payload: IJWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRY,
    } as any);
};

export const verifyToken = (token: string): IJWTPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as IJWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const decodeToken = (token: string): IJWTPayload | null => {
    try {
        const decoded = jwt.decode(token);
        return decoded as IJWTPayload | null;
    } catch (error) {
        return null;
    }
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access Token Required' });

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = await User.findByPk(decoded.UserID);
        if (!user) return res.status(401).json({ message: 'Invalid Token' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

export const authorizeRoles = (roles: number[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        if (!roles.includes(req.user.UserType)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

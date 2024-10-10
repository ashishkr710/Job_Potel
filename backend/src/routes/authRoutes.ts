import express from 'express';
import { register, login, resetPassword } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Registration Route
router.post('/register', register);

// Login Route
router.post('/login', login);

// Password Reset Route
router.post('/reset-password', authenticateToken, resetPassword);

export default router;

import express from 'express';
import { getProfile, updateProfile, getDashboardData } from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = express.Router();

// Get User Profile
router.get('/profile', authenticateToken, getProfile);

// Update User Profile
router.put('/profile', authenticateToken, upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 },
]), updateProfile);

// Get Dashboard Data
router.get('/dashboard', authenticateToken, getDashboardData);

export default router;

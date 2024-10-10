import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
import { generatePassword } from '../utils/generatePassword';
import { sendWelcomeEmail } from '../services/emailService';
import { registrationSchema, loginSchema, resetPasswordSchema } from '../validations/userValidation';
import { any, string } from 'joi';

dotenv.config();

// Registration Handler
export const register = async (req: Request, res: Response) => {
    try {
        // Validate input
        const { error } = registrationSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { FirstName, LastName, Email, PhoneNumber, Gender, UserType, Hobbies, AssociatedAgencyID } = req.body;

        // Check if Email already exists
        const existingUser = await User.findOne({ where: { Email } });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        // Handle file uploads
        let ResumePath: string | undefined;
        let ProfilePicturePath: string | undefined;

        if (UserType === 1) { // Job Seeker
            if (!req.files || !('resume' in req.files) || !('profilePicture' in req.files)) {
                return res.status(400).json({ message: 'Resume and Profile Picture are required for Job Seekers' });
            }

            const resume = (req.files as any).resume[0];
            const profilePicture = (req.files as any).profilePicture[0];

            ResumePath = resume.path;
            ProfilePicturePath = profilePicture.path;
        }

        // Generate auto password
        const autoPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(autoPassword, 10);

        // Create User
        const newUser = await User.create({
            FirstName,
            LastName,
            Email,
            Password: hashedPassword,
            PhoneNumber,
            Gender,
            UserType,
            ResumePath,
            ProfilePicturePath,
            Hobbies: Hobbies ? Hobbies.join(',') : null,
            AssociatedAgencyID: UserType === 1 ? AssociatedAgencyID : null,
        });

        // Send Welcome Email
        await sendWelcomeEmail(Email, autoPassword, FirstName);

        return res.status(201).json({ message: 'Registration successful. Please check your email for your password.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Login Handler
export const login = async (req: Request, res: Response) => {
    try {
        // Validate input
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { Email, Password } = req.body;

        // Find user by Email
        const user = await User.findOne({ where: { Email } });
        if (!user) return res.status(400).json({ message: 'Invalid Email or Password' });

        // Compare Password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Email or Password' });

        // Generate JWT
        const token = jwt.sign({ UserID: user.UserID }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        // Check if first login
        if (user.IsFirstLogin) {
            return res.status(200).json({ token, isFirstLogin: true });
        }

        return res.status(200).json({ token, isFirstLogin: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Password Reset Handler
export const resetPassword = async (req: Request, res: Response) => {
    try {
        // Validate input
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { newPassword } = req.body;
        const user = (req as any).user;

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and IsFirstLogin flag
        user.Password = hashedPassword;
        user.IsFirstLogin = false;
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

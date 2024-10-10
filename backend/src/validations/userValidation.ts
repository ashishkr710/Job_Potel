import Joi from 'joi';

// Registration Validation
export const registrationSchema = Joi.object({
    FirstName: Joi.string().max(100).required(),
    LastName: Joi.string().max(100).required(),
    Email: Joi.string().email().max(255).required(),
    PhoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    Gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    UserType: Joi.number().valid(1, 2).required(),
    Hobbies: Joi.array().items(Joi.string().valid('Sports', 'Dance', 'Singing', 'Reading')).optional(),
    AssociatedAgencyID: Joi.number().integer().optional(), // Only for Job Seekers
});

// Login Validation
export const loginSchema = Joi.object({
    Email: Joi.string().email().max(255).required(),
    Password: Joi.string().min(6).required(),
});

// Reset Password Validation
export const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).required(),
});

// Update Profile Validation
export const updateProfileSchema = Joi.object({
    FirstName: Joi.string().max(100).optional(),
    LastName: Joi.string().max(100).optional(),
    PhoneNumber: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    Gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
    Hobbies: Joi.array().items(Joi.string().valid('Sports', 'Dance', 'Singing', 'Reading')).optional(),
    AssociatedAgencyID: Joi.number().integer().optional(),
});

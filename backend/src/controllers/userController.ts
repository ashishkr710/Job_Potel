import { Request, Response } from 'express';
import User from '../models/User';
import { updateProfileSchema } from '../validations/userValidation';
import { sendWelcomeEmail } from '../services/emailService';

// Get Profile Handler
export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        const profile = {
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            PhoneNumber: user.PhoneNumber,
            Gender: user.Gender,
            UserType: user.UserType,
            Hobbies: user.Hobbies ? user.Hobbies.split(',') : [],
            ResumePath: user.ResumePath,
            ProfilePicturePath: user.ProfilePicturePath,
            AgencyName: user.AgencyName,
            AssociatedAgencyID: user.AssociatedAgencyID,
        };

        // If Job Seeker, fetch Agency details
        if (user.UserType === 1 && user.AssociatedAgencyID) {
            const agency = await User.findByPk(user.AssociatedAgencyID);
            if (agency) {
                profile['Agency'] = {
                    UserID: agency.UserID,
                    FirstName: agency.FirstName,
                    LastName: agency.LastName,
                    AgencyName: agency.AgencyName,
                };
            }
        }

        // If Agency, fetch associated Job Seekers
        if (user.UserType === 2) {
            const jobSeekers = await User.findAll({ where: { AssociatedAgencyID: user.UserID } });
            profile['JobSeekers'] = jobSeekers.map(js => ({
                UserID: js.UserID,
                FirstName: js.FirstName,
                LastName: js.LastName,
                Email: js.Email,
                ResumePath: js.ResumePath,
            }));
        }

        return res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Update Profile Handler
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        // Validate input
        const { error } = updateProfileSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { FirstName, LastName, PhoneNumber, Gender, Hobbies, AssociatedAgencyID } = req.body;

        // Update fields
        user.FirstName = FirstName || user.FirstName;
        user.LastName = LastName || user.LastName;
        user.PhoneNumber = PhoneNumber || user.PhoneNumber;
        user.Gender = Gender || user.Gender;
        user.Hobbies = Hobbies ? Hobbies.join(',') : user.Hobbies;

        if (user.UserType === 1) { // Job Seeker
            user.AssociatedAgencyID = AssociatedAgencyID || user.AssociatedAgencyID;

            // Handle file uploads
            if (req.files) {
                if ('resume' in req.files) {
                    const resume = (req.files as any).resume[0];
                    user.ResumePath = resume.path;
                }
                if ('profilePicture' in req.files) {
                    const profilePicture = (req.files as any).profilePicture[0];
                    user.ProfilePicturePath = profilePicture.path;
                }
            }
        }

        await user.save();

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Get Dashboard Data Handler
export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (user.UserType === 2) { // Agency
            const jobSeekers = await User.findAll({
                where: { AssociatedAgencyID: user.UserID },
                attributes: ['UserID', 'FirstName', 'LastName', 'ResumePath'],
            });

            return res.status(200).json({ jobSeekers });
        } else if (user.UserType === 1) { // Job Seeker
            if (user.AssociatedAgencyID) {
                const agency = await User.findByPk(user.AssociatedAgencyID, {
                    attributes: ['UserID', 'FirstName', 'LastName', 'AgencyName'],
                });
                return res.status(200).json({ agencies: [agency] });
            } else {
                return res.status(200).json({ agencies: [] });
            }
        }

        return res.status(400).json({ message: 'Invalid User Type' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

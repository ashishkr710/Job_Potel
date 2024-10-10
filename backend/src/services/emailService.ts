import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like SendGrid
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, password: string, firstName: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to Job Agency Platform',
        text: `Hello ${firstName},

Welcome to our platform! Your account has been successfully created.

Here are your login credentials:

Email: ${to}
Password: ${password}

Please log in and change your password immediately.

Best regards,
Job Agency Team`,
    };

    await transporter.sendMail(mailOptions);
};

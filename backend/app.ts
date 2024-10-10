// // backend/app.ts
// import express from 'express';
// import cors from 'cors';
// import authRoutes from './routes/auth';
// import userRoutes from './routes/users';
// import agencyRoutes from './routes/agencies';
// import jobSeekerRoutes from './routes/jobseekers';
// import hobbyRoutes from './routes/hobbies';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads')); // Serve uploaded files

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/agencies', agencyRoutes);
// app.use('/api/jobseekers', jobSeekerRoutes);
// app.use('/api/hobbies', hobbyRoutes);

// export default app;

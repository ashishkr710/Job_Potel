// // backend/utils/generateToken.ts
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// const generateToken = (userId: number, userType: number) => {
//   return jwt.sign({ id: userId, type: userType }, process.env.JWT_SECRET!, {
//     expiresIn: '1h',
//   });
// };

// export default generateToken;

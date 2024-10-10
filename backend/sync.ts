// // backend/sync.ts
// import sequelize from './config/database';
// import User from './models/User';
// import Agency from './models/Agency';
// import JobSeeker from './models/JobSeeker';
// import Hobby from './models/Hobby';
// import UserHobbies from './models/UserHobbies';

// const syncDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected.');

//     await sequelize.sync({ force: false });
//     console.log('Models synchronized.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

// syncDatabase();

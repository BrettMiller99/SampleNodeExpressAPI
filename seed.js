const { faker } = require('@faker-js/faker');
const sequelize = require('./config/database');
const User = require('./models/User');
const { UniqueConstraintError } = require('sequelize');

const seedUsers = async (totalUsers) => {
  const mainStartTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting the seeding process for ${totalUsers} users.`);

  try {
    await sequelize.sync({ force: true });
    console.log('Database synced. Seeding users...');

    let usersCreated = 0;
    while (usersCreated < totalUsers) {
      try {
        await User.create({
          name: faker.person.fullName(),
          email: faker.internet.email(),
        });
        usersCreated++;

        if (usersCreated % 1000 === 0) {
          console.log(`Seeded ${usersCreated} / ${totalUsers} users...`);
        }
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          // This is expected, just try again with a new user
          console.log('Duplicate email generated, trying again...');
        } else {
          // For any other error, we should stop
          throw error;
        }
      }
    }

    console.log(`\n${usersCreated} users have been seeded successfully.`);
    const finalCount = await User.count();
    console.log(`Final user count in database: ${finalCount}`);

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await sequelize.close();
    const mainEndTime = Date.now();
    console.log(`Database connection closed. Total time: ${mainEndTime - mainStartTime}ms`);
  }
};

const userCount = process.argv[2] || 50000; // Default to 50000 users
seedUsers(parseInt(userCount, 10));

const faker = require('faker');
const sequelize = require('./config/database');
const User = require('./models/User');

const seedUsers = async (count) => {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists

    const users = [];
    for (let i = 0; i < count; i++) {
      users.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
      });
    }

    await User.bulkCreate(users);
    console.log(`${count} users have been seeded successfully.`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await sequelize.close();
  }
};

const userCount = process.argv[2] || 1000; // Default to 1000 users
seedUsers(parseInt(userCount, 10));

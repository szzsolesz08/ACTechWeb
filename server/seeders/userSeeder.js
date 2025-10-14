const mongoose = require('mongoose');
const User = require('../models/User');
const users = require('./data/users');
require('dotenv').config();

const seedUsers = async (skipConnection = false) => {
  try {
    if (!skipConnection) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected for seeding users...');
    }

    await User.deleteMany({});
    console.log('Existing users cleared');

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`${createdUsers.length} users seeded successfully!`);

    console.log('\nSeeded Users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
    });

    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedUsers;

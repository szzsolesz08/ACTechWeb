import User from '../models/User.js';
import users from './data/users.js';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async (skipSync = false) => {
  try {
    console.log('Seeding users...');

    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`${createdUsers.length} users seeded successfully!`);

    console.log('\nSeeded Users:');
    createdUsers.forEach((user) => {
      console.log(
        `- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`
      );
    });

    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedUsers;

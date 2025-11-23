import Contact from '../models/Contact.js';
import User from '../models/User.js';
import getContactsData from './data/contacts.js';
import dotenv from 'dotenv';
import sequelize from '../config/database.js';

dotenv.config();

const seedContacts = async (skipSync = false) => {
  try {
    const technicians = await User.findAll({ where: { role: 'technician' } });

    if (technicians.length === 0) {
      console.log('Please run userSeeder first to create users!');
      throw new Error('No technicians found. Run userSeeder first.');
    }

    const contacts = getContactsData(technicians);
    const createdContacts = await Contact.bulkCreate(contacts);
    console.log(`${createdContacts.length} contacts seeded successfully!`);

    const statusCounts = await Contact.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    console.log('\nContact Statistics:');
    statusCounts.forEach((stat) => {
      console.log(`- ${stat.status}: ${stat.getDataValue('count')}`);
    });

    console.log('\nSample Contact Messages:');
    createdContacts.slice(0, 5).forEach((contact) => {
      console.log(`- ${contact.name} (${contact.subject}) - ${contact.status}`);
    });

    return createdContacts;
  } catch (error) {
    console.error('Error seeding contacts:', error);
    throw error;
  }
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedContacts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedContacts;

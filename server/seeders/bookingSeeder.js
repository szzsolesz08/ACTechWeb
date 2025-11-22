import Booking from '../models/Booking.js';
import User from '../models/User.js';
import getBookingsData from './data/bookings.js';
import dotenv from 'dotenv';
import sequelize from '../config/database.js';

dotenv.config();

const seedBookings = async (skipSync = false) => {
  try {
    const customers = await User.findAll({ where: { role: 'customer' } });
    const technicians = await User.findAll({ where: { role: 'technician' } });

    if (customers.length === 0 || technicians.length === 0) {
      console.log('Please run userSeeder first to create users!');
      throw new Error('No users found. Run userSeeder first.');
    }

    const bookings = getBookingsData(customers, technicians).map((booking) => ({
      ...booking,
      referenceNumber: 'AC' + Math.floor(100000 + Math.random() * 900000),
    }));

    const createdBookings = await Booking.bulkCreate(bookings);
    console.log(`${createdBookings.length} bookings seeded successfully!`);

    const statusCounts = await Booking.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    console.log('\nBooking Statistics:');
    statusCounts.forEach((stat) => {
      console.log(`- ${stat.status}: ${stat.getDataValue('count')}`);
    });

    console.log('\nSample Booking Reference Numbers:');
    createdBookings.slice(0, 5).forEach((booking) => {
      console.log(
        `- ${booking.referenceNumber} (${booking.serviceType} - ${booking.status})`
      );
    });

    return createdBookings;
  } catch (error) {
    console.error('Error seeding bookings:', error);
    throw error;
  }
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedBookings()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedBookings;

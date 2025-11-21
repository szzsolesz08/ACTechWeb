const mongoose = require('mongoose')
const Booking = require('../models/Booking')
const User = require('../models/User')
const getBookingsData = require('./data/bookings')
require('dotenv').config()

const seedBookings = async (skipConnection = false) => {
  try {
    if (!skipConnection) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log('MongoDB connected for seeding bookings...')
    }

    const customers = await User.find({ role: 'customer' })
    const technicians = await User.find({ role: 'technician' })

    if (customers.length === 0 || technicians.length === 0) {
      console.log('Please run userSeeder first to create users!')
      throw new Error('No users found. Run userSeeder first.')
    }

    await Booking.deleteMany({})
    console.log('Existing bookings cleared')

    const bookings = getBookingsData(customers, technicians).map((booking) => ({
      ...booking,
      referenceNumber: 'AC' + Math.floor(100000 + Math.random() * 900000),
    }))

    const createdBookings = await Booking.insertMany(bookings)
    console.log(`${createdBookings.length} bookings seeded successfully!`)

    const statusCounts = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    console.log('\nBooking Statistics:')
    statusCounts.forEach((stat) => {
      console.log(`- ${stat._id}: ${stat.count}`)
    })

    console.log('\nSample Booking Reference Numbers:')
    createdBookings.slice(0, 5).forEach((booking) => {
      console.log(
        `- ${booking.referenceNumber} (${booking.serviceType} - ${booking.status})`
      )
    })

    return createdBookings
  } catch (error) {
    console.error('Error seeding bookings:', error)
    throw error
  }
}

if (require.main === module) {
  seedBookings()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

module.exports = seedBookings

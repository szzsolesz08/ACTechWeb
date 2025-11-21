const mongoose = require('mongoose')
require('dotenv').config()

const seedUsers = require('./userSeeder')
const seedBookings = require('./bookingSeeder')

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected for seeding...\n')

    console.log('='.repeat(50))
    console.log('STARTING DATABASE SEEDING')
    console.log('='.repeat(50) + '\n')

    const createdUsers = await seedUsers(true)
    console.log('')

    const createdBookings = await seedBookings(true)
    console.log('')

    console.log('='.repeat(50))
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!')
    console.log('='.repeat(50))
    console.log(`   Users: ${createdUsers.length}`)
    console.log(
      `   - Customers: ${createdUsers.filter((u) => u.role === 'customer').length}`
    )
    console.log(
      `   - Technicians: ${createdUsers.filter((u) => u.role === 'technician').length}`
    )
    console.log(
      `   - Admins: ${createdUsers.filter((u) => u.role === 'admin').length}`
    )
    console.log(`   Bookings: ${createdBookings.length}`)

    console.log('\n' + '='.repeat(50))
    console.log('You can now start the server with: npm start')
    console.log('='.repeat(50) + '\n')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()

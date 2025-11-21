const mongoose = require('mongoose')
const Contact = require('../models/Contact')
const User = require('../models/User')
const getContactsData = require('./data/contacts')
require('dotenv').config()

const seedContacts = async (skipConnection = false) => {
  try {
    if (!skipConnection) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log('MongoDB connected for seeding contacts...')
    }

    const users = await User.find()

    if (users.length === 0) {
      console.log('Please run userSeeder first to create users!')
      throw new Error('No users found. Run userSeeder first.')
    }

    await Contact.deleteMany({})
    console.log('Existing contacts cleared')

    const contacts = getContactsData(users)

    const createdContacts = await Contact.insertMany(contacts)
    console.log(
      `${createdContacts.length} contact messages seeded successfully!`
    )

    const statusCounts = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    console.log('\nContact Message Statistics:')
    statusCounts.forEach((stat) => {
      console.log(`- ${stat._id}: ${stat.count}`)
    })

    const subjectCounts = await Contact.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
    ])

    console.log('\nContact Messages by Subject:')
    subjectCounts.forEach((stat) => {
      console.log(`- ${stat._id}: ${stat.count}`)
    })

    console.log('\nSample Contact Messages:')
    createdContacts.slice(0, 3).forEach((contact) => {
      console.log(`- ${contact.name} (${contact.subject}) - ${contact.status}`)
    })

    return createdContacts
  } catch (error) {
    console.error('Error seeding contacts:', error)
    throw error
  }
}

if (require.main === module) {
  seedContacts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

module.exports = seedContacts

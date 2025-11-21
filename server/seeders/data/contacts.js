const { faker } = require('@faker-js/faker')

const subjects = ['quote', 'service', 'support', 'feedback', 'other']

const statuses = ['new', 'read', 'in-progress', 'resolved', 'closed']

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)]

const getRandomPastDate = (daysBack) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
  date.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    0,
    0
  )
  return date
}

const generateMessage = (subject) => {
  const messages = {
    quote: [
      'I would like to get a quote for installing a new AC unit in my 3-bedroom apartment. What are your rates?',
      'Can you provide a quote for replacing my old AC system with a more energy-efficient model?',
      'Looking for a price estimate for installing split AC units in two rooms.',
      'Need a quote for commercial AC installation in a 200 sqm office space.',
      'Interested in your annual maintenance plans. Could you send me pricing details?',
    ],
    service: [
      'I need to schedule a maintenance service for my AC unit before summer starts.',
      'My AC needs a filter replacement and general check-up. When can you come?',
      'Would like to book a pre-season inspection for my air conditioning system.',
      'Can I schedule a service appointment for next week? My AC is making unusual sounds.',
      'Need to arrange regular maintenance for my office AC units.',
    ],
    support: [
      'My AC is not cooling properly. It was working fine last week but now barely blows cold air.',
      'The AC remote control stopped working. Do you sell replacements?',
      'There is water leaking from my indoor unit. Is this an emergency?',
      'My AC turns off automatically after running for 10 minutes. What could be the problem?',
      'The AC is making a loud rattling noise. Should I turn it off?',
      'Error code E3 is showing on my AC display. What does this mean?',
    ],
    feedback: [
      'Just wanted to say thank you for the excellent service last week. The technician was very professional!',
      'Very satisfied with the installation service. Everything was done perfectly and on time.',
      'The maintenance service was thorough and the technician explained everything clearly.',
      'Great experience! Will definitely recommend your services to friends.',
      'Quick response time and fair pricing. Happy with the repair work done.',
    ],
    other: [
      'Do you offer emergency services on weekends?',
      'What brands of AC units do you work with?',
      'Are your technicians certified? I need documentation for insurance purposes.',
      'Do you provide warranty for your installation work?',
      'Can you help with AC unit disposal when replacing with a new one?',
      'What payment methods do you accept?',
    ],
  }

  return getRandomElement(messages[subject] || messages.other)
}

const generateNotes = (status) => {
  const notes = {
    read: ['', '', ''], // Most read messages don't have notes yet
    'in-progress': [
      'Waiting for customer to confirm preferred date',
      'Quote prepared, sent to customer via email',
      'Technician assigned, will contact customer',
      'Checking parts availability',
      'Scheduled for site visit next week',
    ],
    resolved: [
      'Quote sent and accepted, booking created',
      'Customer inquiry answered via phone',
      'Issue resolved remotely, provided troubleshooting steps',
      'Scheduled service appointment',
      'Provided product recommendations',
    ],
    closed: [
      'Customer decided not to proceed',
      'Duplicate inquiry, merged with existing ticket',
      'Spam message, no action needed',
      'Customer found solution themselves',
      'Inquiry handled, customer satisfied',
    ],
  }

  if (status === 'new') return ''
  return getRandomElement(notes[status] || [''])
}

const generateContact = (users) => {
  const subject = getRandomElement(subjects)
  const createdAt = getRandomPastDate(60) // Last 60 days

  // Determine status based on how old the message is
  const daysOld = Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24))
  let status

  if (daysOld < 2) {
    status = Math.random() > 0.3 ? 'new' : 'read'
  } else if (daysOld < 7) {
    const rand = Math.random()
    if (rand < 0.2) status = 'new'
    else if (rand < 0.4) status = 'read'
    else if (rand < 0.7) status = 'in-progress'
    else status = 'resolved'
  } else {
    const rand = Math.random()
    if (rand < 0.1) status = 'in-progress'
    else if (rand < 0.5) status = 'resolved'
    else status = 'closed'
  }

  const contact = {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone:
      Math.random() > 0.2
        ? `+36 ${faker.string.numeric(2)} ${faker.string.numeric(3)} ${faker.string.numeric(4)}`
        : '',
    subject,
    message: generateMessage(subject),
    status,
    createdAt,
    updatedAt:
      status === 'new'
        ? createdAt
        : faker.date.between({ from: createdAt, to: new Date() }),
  }

  // Assign to staff if status is not 'new'
  if (status !== 'new' && users && users.length > 0 && Math.random() > 0.3) {
    const staffMembers = users.filter(
      (u) => u.role === 'admin' || u.role === 'technician'
    )
    if (staffMembers.length > 0) {
      contact.assignedTo = getRandomElement(staffMembers)._id
    }
  }

  // Add notes based on status
  contact.notes = generateNotes(status)

  return contact
}

module.exports = (users) => {
  const contacts = []

  // Generate 50 contact messages
  for (let i = 0; i < 50; i++) {
    contacts.push(generateContact(users))
  }

  return contacts
}

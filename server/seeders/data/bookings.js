const { faker } = require('@faker-js/faker')

const serviceTypes = [
  { value: 'installation', name: 'Installation' },
  { value: 'repair', name: 'Repair' },
  { value: 'maintenance', name: 'Maintenance' },
  { value: 'inspection', name: 'Inspection' },
  { value: 'consultation', name: 'Consultation' },
  { value: 'maintenance-plan', name: 'Annual Maintenance Plan' },
]

const units = [
  { id: 1, name: 'Daikin Perfera 2.5 kW', price: 599900 },
  {
    id: 2,
    name: 'Mitsubishi MUZ-AP60VG2 + MSZ-AP60VGK2 Kompakt 6.1 kW',
    price: 720800,
  },
  { id: 3, name: 'LG Artcool Gallery Special 2,5kW', price: 519990 },
  { id: 4, name: 'Panasonic Etherea 2.0 kW', price: 254000 },
  { id: 5, name: 'Toshiba Seiya 3.5kW', price: 351990 },
  { id: 6, name: 'Gree GWH12ACC-K6DNA1D COMFORT X', price: 246000 },
]

const servicePrices = {
  installation: 80000,
  repair: 108000,
  maintenance: 55000,
  inspection: 40000,
  consultation: 5000,
}

const maintenancePlans = [
  { id: 'basic', price: 86000 },
  { id: 'premium', price: 151000 },
]

const timeSlots = [
  '8:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
]

const statuses = [
  'pending',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
]

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)]

const getRandomDateInYear = (year) => {
  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year, 11, 31)

  const randomTime =
    startOfYear.getTime() +
    Math.random() * (endOfYear.getTime() - startOfYear.getTime())
  return new Date(randomTime)
}

const getRandomFutureDate = (daysAhead) => {
  const date = new Date()
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1)
  return date
}

const getRandomPastDate = (daysBack) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack) - 1)
  return date
}

const calculatePrice = (serviceType, unit, maintenancePlan) => {
  if (serviceType === 'installation' && unit) {
    return units.find((u) => u.id === unit).price + servicePrices.installation
  }
  if (serviceType === 'maintenance-plan' && maintenancePlan) {
    return maintenancePlans.find((p) => p.id === maintenancePlan).price
  }
  return servicePrices[serviceType] || 0
}

const generateBookingDescription = (serviceType, unit, maintenancePlan) => {
  const descriptions = {
    installation: [
      `Need installation of new ${unit ? units.find((u) => u.id === unit)?.name : 'AC unit'} in living room`,
      `Installation required for ${unit ? units.find((u) => u.id === unit)?.name : 'AC system'} in bedroom`,
      `Professional installation needed for new AC unit in office space`,
    ],
    repair: [
      'AC unit not cooling properly, making strange noises',
      'Refrigerant leak repair needed',
      'AC not turning on, possible electrical issue',
      'Compressor making loud noise, needs inspection',
      'Water leaking from indoor unit',
    ],
    maintenance: [
      'Regular seasonal maintenance check-up needed',
      'Annual maintenance service required',
      'Pre-summer AC tune-up and cleaning',
      'Filter cleaning and system check',
    ],
    inspection: [
      'Pre-purchase inspection for used AC unit',
      'Annual safety inspection required',
      'Diagnostic inspection for performance issues',
      'Post-installation quality check',
    ],
    consultation: [
      'Consultation for new AC system for 3-bedroom apartment',
      'Need advice on energy-efficient AC options',
      'Consultation for commercial AC installation',
      'Seeking recommendations for AC upgrade',
    ],
    'maintenance-plan': [
      `${maintenancePlan === 'premium' ? 'Premium' : 'Basic'} plan quarterly check-up`,
      `${maintenancePlan === 'premium' ? 'Premium' : 'Basic'} plan - seasonal maintenance`,
      `Scheduled ${maintenancePlan} maintenance plan service`,
    ],
  }

  return getRandomElement(descriptions[serviceType] || ['Service requested'])
}

const generateBooking = (customers, technicians, year) => {
  const serviceType = getRandomElement(serviceTypes).value
  const customer = getRandomElement(customers)
  const date = getRandomDateInYear(year)

  const now = new Date()
  let status

  if (date < now) {
    status = Math.random() > 0.15 ? 'completed' : 'cancelled'
  } else {
    const rand = Math.random()
    if (rand < 0.5) {
      status = 'pending'
    } else if (rand < 0.85) {
      status = 'confirmed'
    } else {
      status = 'in-progress'
    }
  }

  const booking = {
    user: customer._id,
    serviceType,
    date,
    timeSlot: getRandomElement(timeSlots),
    customerInfo: {
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      address: `${customer.address}, ${customer.city}`,
    },
    status,
  }

  if (serviceType === 'installation') {
    const unit = getRandomElement(units)
    booking.unit = unit.id
  }

  if (serviceType === 'maintenance-plan') {
    booking.maintenancePlan = getRandomElement(maintenancePlans).id
  }

  booking.price = calculatePrice(
    serviceType,
    booking.unit,
    booking.maintenancePlan
  )

  booking.description = generateBookingDescription(
    serviceType,
    booking.unit,
    booking.maintenancePlan
  )

  if (['confirmed', 'in-progress', 'completed'].includes(status)) {
    booking.assignedTechnician = getRandomElement(technicians)._id
  }

  if (status === 'pending' && Math.random() > 0.5) {
    booking.preferredTechnician = getRandomElement(technicians)._id
  }

  if (status === 'in-progress') {
    const inProgressNotes = [
      'Technician on site, working on the issue',
      'Parts ordered, waiting for delivery',
      'Diagnostic completed, starting repairs',
      'Installation in progress, 50% complete',
    ]
    booking.notes = getRandomElement(inProgressNotes)
  }

  if (status === 'completed') {
    const completedNotes = [
      'Service completed successfully, customer satisfied',
      'Filter replaced, system cleaned, all working properly',
      'Installation completed, system tested and operational',
      'Repair completed, no further issues detected',
      'Maintenance completed, next service due in 6 months',
    ]
    booking.notes = getRandomElement(completedNotes)
  }

  if (status === 'cancelled') {
    const cancelledNotes = [
      'Customer cancelled - issue resolved by resetting circuit breaker',
      'Customer rescheduled for later date',
      'Customer cancelled - purchased new unit instead',
      'Weather conditions - rescheduled',
    ]
    booking.notes = getRandomElement(cancelledNotes)
  }

  return booking
}

module.exports = (customers, technicians) => {
  const bookings = []

  for (let i = 0; i < 200; i++) {
    bookings.push(generateBooking(customers, technicians, 2024))
  }

  for (let i = 0; i < 200; i++) {
    bookings.push(generateBooking(customers, technicians, 2025))
  }

  return bookings
}

const oldBookings = (customers, technicians) => [
  {
    user: customers[0]._id,
    serviceType: 'installation',
    unit: 1,
    price: 679900,
    date: getRandomFutureDate(15),
    timeSlot: timeSlots[0],
    customerInfo: {
      name: `${customers[0].firstName} ${customers[0].lastName}`,
      email: customers[0].email,
      phone: customers[0].phone,
      address: `${customers[0].address}, ${customers[0].city}`,
    },
    description:
      'Need installation of new Daikin Perfera 2.5 kW AC unit in living room',
    preferredTechnician: technicians[0]._id,
    status: 'pending',
  },
  {
    user: customers[1]._id,
    serviceType: 'repair',
    price: 108000,
    date: getRandomFutureDate(10),
    timeSlot: timeSlots[2],
    customerInfo: {
      name: `${customers[1].firstName} ${customers[1].lastName}`,
      email: customers[1].email,
      phone: customers[1].phone,
      address: `${customers[1].address}, ${customers[1].city}`,
    },
    description: 'AC unit not cooling properly, making strange noises',
    status: 'pending',
  },
  {
    serviceType: 'maintenance',
    price: 55000,
    date: getRandomFutureDate(20),
    timeSlot: timeSlots[1],
    customerInfo: {
      name: 'Anna Kovács',
      email: 'anna.kovacs@example.com',
      phone: '+36 30 111 2222',
      address: 'Nagymező utca 12, Budapest',
    },
    description: 'Regular seasonal maintenance check-up needed',
    status: 'pending',
  },
  {
    user: customers[0]._id,
    serviceType: 'maintenance-plan',
    maintenancePlan: 'premium',
    price: 151000,
    date: getRandomFutureDate(7),
    timeSlot: timeSlots[3],
    customerInfo: {
      name: `${customers[0].firstName} ${customers[0].lastName}`,
      email: customers[0].email,
      phone: customers[0].phone,
      address: `${customers[0].address}, ${customers[0].city}`,
    },
    description: 'Premium plan quarterly check-up',
    assignedTechnician: technicians[1]._id,
    status: 'confirmed',
  },
  {
    user: customers[2]._id,
    serviceType: 'inspection',
    price: 40000,
    date: getRandomFutureDate(5),
    timeSlot: timeSlots[0],
    customerInfo: {
      name: `${customers[2].firstName} ${customers[2].lastName}`,
      email: customers[2].email,
      phone: customers[2].phone,
      address: `${customers[2].address}, ${customers[2].city}`,
    },
    description: 'Pre-purchase inspection for used AC unit',
    assignedTechnician: technicians[0]._id,
    status: 'confirmed',
  },
  {
    user: customers[1]._id,
    serviceType: 'repair',
    price: 108000,
    date: new Date(),
    timeSlot: timeSlots[1],
    customerInfo: {
      name: `${customers[1].firstName} ${customers[1].lastName}`,
      email: customers[1].email,
      phone: customers[1].phone,
      address: `${customers[1].address}, ${customers[1].city}`,
    },
    description: 'Refrigerant leak repair',
    assignedTechnician: technicians[2]._id,
    status: 'in-progress',
    notes: 'Technician on site, replacing refrigerant lines',
  },
  {
    user: customers[0]._id,
    serviceType: 'maintenance',
    price: 55000,
    date: getRandomPastDate(30),
    timeSlot: timeSlots[2],
    customerInfo: {
      name: `${customers[0].firstName} ${customers[0].lastName}`,
      email: customers[0].email,
      phone: customers[0].phone,
      address: `${customers[0].address}, ${customers[0].city}`,
    },
    description: 'Annual maintenance service',
    assignedTechnician: technicians[0]._id,
    status: 'completed',
    notes: 'Filter replaced, system cleaned, all working properly',
  },
  {
    user: customers[1]._id,
    serviceType: 'installation',
    unit: 3,
    price: 599990,
    date: getRandomPastDate(45),
    timeSlot: timeSlots[0],
    customerInfo: {
      name: `${customers[1].firstName} ${customers[1].lastName}`,
      email: customers[1].email,
      phone: customers[1].phone,
      address: `${customers[1].address}, ${customers[1].city}`,
    },
    description: 'Installation of LG Artcool Gallery 2.5kW',
    assignedTechnician: technicians[1]._id,
    status: 'completed',
    notes: 'Installation completed successfully, customer satisfied',
  },
  {
    serviceType: 'consultation',
    price: 5000,
    date: getRandomPastDate(15),
    timeSlot: timeSlots[4],
    customerInfo: {
      name: 'László Nagy',
      email: 'laszlo.nagy@example.com',
      phone: '+36 70 333 4444',
      address: 'Bajcsy-Zsilinszky út 78, Budapest',
    },
    description: 'Consultation for new AC system for 3-bedroom apartment',
    assignedTechnician: technicians[0]._id,
    status: 'completed',
    notes: 'Recommended multi-split system, provided quote',
  },
  {
    user: customers[2]._id,
    serviceType: 'repair',
    price: 108000,
    date: getRandomPastDate(10),
    timeSlot: timeSlots[3],
    customerInfo: {
      name: `${customers[2].firstName} ${customers[2].lastName}`,
      email: customers[2].email,
      phone: customers[2].phone,
      address: `${customers[2].address}, ${customers[2].city}`,
    },
    description: 'AC not turning on',
    status: 'cancelled',
    notes: 'Customer cancelled - issue resolved by resetting circuit breaker',
  },
  {
    user: customers[0]._id,
    serviceType: 'maintenance-plan',
    maintenancePlan: 'basic',
    price: 86000,
    date: getRandomFutureDate(25),
    timeSlot: timeSlots[1],
    customerInfo: {
      name: `${customers[0].firstName} ${customers[0].lastName}`,
      email: customers[0].email,
      phone: customers[0].phone,
      address: `${customers[0].address}, ${customers[0].city}`,
    },
    description: 'Basic plan - seasonal check-up',
    status: 'pending',
  },
  {
    user: customers[1]._id,
    serviceType: 'maintenance-plan',
    maintenancePlan: 'premium',
    price: 151000,
    date: getRandomFutureDate(12),
    timeSlot: timeSlots[2],
    customerInfo: {
      name: `${customers[1].firstName} ${customers[1].lastName}`,
      email: customers[1].email,
      phone: customers[1].phone,
      address: `${customers[1].address}, ${customers[1].city}`,
    },
    description: 'Premium plan - quarterly maintenance with filter replacement',
    assignedTechnician: technicians[1]._id,
    status: 'confirmed',
  },
]

module.exports.oldBookings = oldBookings

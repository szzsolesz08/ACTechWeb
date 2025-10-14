const getRandomFutureDate = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date;
};

const getRandomPastDate = (daysBack) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack) - 1);
  return date;
};

const timeSlots = [
  '8:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00'
];

module.exports = (customers, technicians) => [
  {
    user: customers[0]._id,
    serviceType: 'installation',
    date: getRandomFutureDate(15),
    timeSlot: timeSlots[0],
    customerInfo: {
      name: `${customers[0].firstName} ${customers[0].lastName}`,
      email: customers[0].email,
      phone: customers[0].phone,
      address: `${customers[0].address.street}, ${customers[0].address.city}`
    },
    description: 'Need installation of new Daikin Perfera 2.5 kW AC unit in living room',
    preferredTechnician: technicians[0]._id,
    status: 'pending'
  },
  {
    user: customers[1]._id,
    serviceType: 'repair',
    date: getRandomFutureDate(10),
    timeSlot: timeSlots[2],
    customerInfo: {
      name: `${customers[1].firstName} ${customers[1].lastName}`,
      email: customers[1].email,
      phone: customers[1].phone,
      address: `${customers[1].address.street}, ${customers[1].address.city}`
    },
    description: 'AC unit not cooling properly, making strange noises',
    status: 'pending'
  },
  {
    serviceType: 'maintenance',
    date: getRandomFutureDate(20),
    timeSlot: timeSlots[1],
    customerInfo: {
      name: 'Anna Kovács',
      email: 'anna.kovacs@example.com',
      phone: '+36 30 111 2222',
      address: 'Nagymező utca 12, Budapest'
    },
    description: 'Regular seasonal maintenance check-up needed',
    status: 'pending'
  },
  {
    user: customers[0]._id,
    serviceType: 'maintenance-plan',
    maintenancePlan: 'premium',
    date: getRandomFutureDate(7),
    timeSlot: timeSlots[3],
    customerInfo: {
      name: `${customers[0].firstName} ${customers[0].lastName}`,
      email: customers[0].email,
      phone: customers[0].phone,
      address: `${customers[0].address.street}, ${customers[0].address.city}`
    },
    description: 'Premium plan quarterly check-up',
    assignedTechnician: technicians[1]._id,
    status: 'confirmed'
  },
  {
    user: customers[2]._id,
    serviceType: 'inspection',
    date: getRandomFutureDate(5),
    timeSlot: timeSlots[0],
    customerInfo: {
      name: `${customers[2].firstName} ${customers[2].lastName}`,
      email: customers[2].email,
      phone: customers[2].phone,
      address: `${customers[2].address.street}, ${customers[2].address.city}`
    },
    description: 'Pre-purchase inspection for used AC unit',
    assignedTechnician: technicians[0]._id,
    status: 'confirmed'
  },
  {
    user: customers[1]._id,
    serviceType: 'repair',
    date: new Date(),
    timeSlot: timeSlots[1],
    customerInfo: {
      name: `${customers[1].firstName} ${customers[1].lastName}`,
      email: customers[1].email,
      phone: customers[1].phone,
      address: `${customers[1].address.street}, ${customers[1].address.city}`
    },
    description: 'Refrigerant leak repair',
    assignedTechnician: technicians[2]._id,
    status: 'in-progress',
    notes: 'Technician on site, replacing refrigerant lines'
  },
  {
    user: customers[0]._id,
    serviceType: 'maintenance',
    date: getRandomPastDate(30),
    timeSlot: timeSlots[2],
    customerInfo: {
      name: `${customers[0].firstName} ${customers[0].lastName}`,
      email: customers[0].email,
      phone: customers[0].phone,
      address: `${customers[0].address.street}, ${customers[0].address.city}`
    },
    description: 'Annual maintenance service',
    assignedTechnician: technicians[0]._id,
    status: 'completed',
    notes: 'Filter replaced, system cleaned, all working properly'
  },
  {
    user: customers[1]._id,
    serviceType: 'installation',
    date: getRandomPastDate(45),
    timeSlot: timeSlots[0],
    customerInfo: {
      name: `${customers[1].firstName} ${customers[1].lastName}`,
      email: customers[1].email,
      phone: customers[1].phone,
      address: `${customers[1].address.street}, ${customers[1].address.city}`
    },
    description: 'Installation of LG Artcool Gallery 2.5kW',
    assignedTechnician: technicians[1]._id,
    status: 'completed',
    notes: 'Installation completed successfully, customer satisfied'
  },
  {
    serviceType: 'consultation',
    date: getRandomPastDate(15),
    timeSlot: timeSlots[4],
    customerInfo: {
      name: 'László Nagy',
      email: 'laszlo.nagy@example.com',
      phone: '+36 70 333 4444',
      address: 'Bajcsy-Zsilinszky út 78, Budapest'
    },
    description: 'Consultation for new AC system for 3-bedroom apartment',
    assignedTechnician: technicians[0]._id,
    status: 'completed',
    notes: 'Recommended multi-split system, provided quote'
  },
  {
    user: customers[2]._id,
    serviceType: 'repair',
    date: getRandomPastDate(10),
    timeSlot: timeSlots[3],
    customerInfo: {
      name: `${customers[2].firstName} ${customers[2].lastName}`,
      email: customers[2].email,
      phone: customers[2].phone,
      address: `${customers[2].address.street}, ${customers[2].address.city}`
    },
    description: 'AC not turning on',
    status: 'cancelled',
    notes: 'Customer cancelled - issue resolved by resetting circuit breaker'
  },
  {
    user: customers[0]._id,
    serviceType: 'maintenance-plan',
    maintenancePlan: 'basic',
    date: getRandomFutureDate(25),
    timeSlot: timeSlots[1],
    customerInfo: {
      name: `${customers[0].firstName} ${customers[0].lastName}`,
      email: customers[0].email,
      phone: customers[0].phone,
      address: `${customers[0].address.street}, ${customers[0].address.city}`
    },
    description: 'Basic plan - seasonal check-up',
    status: 'pending'
  },
  {
    user: customers[1]._id,
    serviceType: 'maintenance-plan',
    maintenancePlan: 'premium',
    date: getRandomFutureDate(12),
    timeSlot: timeSlots[2],
    customerInfo: {
      name: `${customers[1].firstName} ${customers[1].lastName}`,
      email: customers[1].email,
      phone: customers[1].phone,
      address: `${customers[1].address.street}, ${customers[1].address.city}`
    },
    description: 'Premium plan - quarterly maintenance with filter replacement',
    assignedTechnician: technicians[1]._id,
    status: 'confirmed'
  }
];

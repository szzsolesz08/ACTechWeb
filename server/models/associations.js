import User from './User.js';
import Booking from './Booking.js';
import Contact from './Contact.js';

// User associations
User.hasMany(Booking, {
  foreignKey: 'userId',
  as: 'bookings'
});

User.hasMany(Booking, {
  foreignKey: 'preferredTechnicianId',
  as: 'preferredBookings'
});

User.hasMany(Booking, {
  foreignKey: 'assignedTechnicianId',
  as: 'assignedBookings'
});

// Booking associations
Booking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Booking.belongsTo(User, {
  foreignKey: 'preferredTechnicianId',
  as: 'preferredTechnician'
});

Booking.belongsTo(User, {
  foreignKey: 'assignedTechnicianId',
  as: 'assignedTechnician'
});

// Contact associations
Contact.belongsTo(User, {
  foreignKey: 'assignedToId',
  as: 'assignedTo'
});

User.hasMany(Contact, {
  foreignKey: 'assignedToId',
  as: 'assignedContacts'
});

export { User, Booking, Contact };

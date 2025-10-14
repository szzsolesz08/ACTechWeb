const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  referenceNumber: {
    type: String,
    unique: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['installation', 'repair', 'maintenance', 'maintenance-plan', 'inspection', 'consultation']
  },
  maintenancePlan: {
    type: String,
    enum: ['basic', 'premium', ''],
    default: ''
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  preferredTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate reference number before saving
bookingSchema.pre('save', function(next) {
  if (!this.referenceNumber) {
    this.referenceNumber = 'AC' + Math.floor(100000 + Math.random() * 900000);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

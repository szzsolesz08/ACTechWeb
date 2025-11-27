import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Booking extends Model {}

Booking.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  referenceNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  serviceType: {
    type: DataTypes.ENUM(
      'installation',
      'repair',
      'maintenance',
      'maintenance-plan',
      'inspection',
      'consultation'
    ),
    allowNull: false,
    validate: {
      notNull: { msg: 'Service type is required' }
    }
  },
  maintenancePlan: {
    type: DataTypes.ENUM('basic', 'premium', ''),
    defaultValue: ''
  },
  unit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: { msg: 'Date is required' }
    }
  },
  timeSlot: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Time slot is required' }
    }
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Customer name is required' }
    }
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Email is required' },
      isEmail: { msg: 'Please enter a valid email' }
    }
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Phone number is required' }
    }
  },
  customerAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Address is required' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Description is required' }
    }
  },
  assignedTechnicianId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  sequelize,
  modelName: 'Booking',
  timestamps: true,
  hooks: {
    beforeCreate: (booking) => {
      if (!booking.referenceNumber) {
        booking.referenceNumber = 'AC' + Math.floor(100000 + Math.random() * 900000);
      }
    }
  }
});

export default Booking;

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Contact extends Model {}

Contact.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Name is required' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Email is required' },
      isEmail: { msg: 'Please enter a valid email' }
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  subject: {
    type: DataTypes.ENUM('quote', 'service', 'support', 'feedback', 'other'),
    allowNull: false,
    validate: {
      notNull: { msg: 'Subject is required' }
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Message is required' }
    }
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'in-progress', 'resolved', 'closed'),
    defaultValue: 'new'
  },
  assignedToId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  sequelize,
  modelName: 'Contact',
  timestamps: true
});

export default Contact;

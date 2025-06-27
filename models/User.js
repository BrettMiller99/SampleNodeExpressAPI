const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100] // Name must be between 2 and 100 characters
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Email format validation
    }
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  // Enable timestamps (createdAt, updatedAt)
  timestamps: true,
  
  // Don't actually delete records, just set deletedAt field
  paranoid: true,
  
  // Add indexes for frequently queried fields
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['deletedAt']
    }
  ]
});

module.exports = User;

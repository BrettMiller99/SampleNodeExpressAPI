const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
};
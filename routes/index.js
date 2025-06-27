const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const sequelize = require('../config/database');
const { checkHealth } = require('../utils/healthCheck');
// User routes with OpenTelemetry instrumentation
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUser);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Additional routes for soft delete functionality
router.delete('/users/:id/permanent', UserController.permanentlyDeleteUser);
router.post('/users/:id/restore', UserController.restoreUser);

// Health check endpoint with OpenTelemetry integration
router.get('/health', async (req, res, next) => {
  try {
    const health = await checkHealth({ database: sequelize });
    res.json(health);
  } catch (error) {
    next(error);
  }
});

// Add correlation ID middleware for request tracking
router.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || 
                        req.headers['x-request-id'] || 
                        `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  req.correlationId = correlationId;
  
  // Add correlation ID to response headers
  res.setHeader('x-correlation-id', correlationId);
  
  next();
});

module.exports = router;
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const sequelize = require('../config/database');
const { checkHealth } = require('../utils/healthCheck');
const { createSpan } = require('../tracing');

// User routes with OpenTelemetry instrumentation
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUser);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Health check endpoint with OpenTelemetry integration
router.get('/health', async (req, res, next) => {
  try {
    return await createSpan('Health Check API', async () => {
      const health = await checkHealth({ database: sequelize });
      res.json(health);
    }, {
      'http.method': 'GET',
      'http.route': '/health',
      'operation.type': 'health_check'
    });
  } catch (error) {
    next(error);
  }
});

// Add correlation ID middleware for request tracking
router.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || 
                        req.headers['x-request-id'] || 
                        `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  // Make correlation ID available to all spans in this request
  req.correlationId = correlationId;
  
  // Add correlation ID to response headers
  res.setHeader('x-correlation-id', correlationId);
  
  next();
});

module.exports = router;
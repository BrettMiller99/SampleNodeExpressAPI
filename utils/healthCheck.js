// Health check utility with OpenTelemetry integration
const { trace } = require('@opentelemetry/api');

/**
 * Health check function that creates a span for monitoring
 * @param {Object} components - System components to check (e.g., database)
 * @returns {Object} Health status of the application
 */
async function checkHealth(components = {}) {
  const tracer = trace.getTracer('user-api');
  const span = tracer.startSpan('Health Check');
  
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      components: {}
    };

    // Add component-specific health checks
    if (components.database) {
      const dbSpan = tracer.startSpan('Database Health Check', {
        parent: span
      });
      
      try {
        await components.database.authenticate();
        health.components.database = { status: 'ok' };
        dbSpan.setStatus({ code: 0 }); // Success
      } catch (error) {
        health.status = 'error';
        health.components.database = { 
          status: 'error',
          message: error.message
        };
        dbSpan.setStatus({ 
          code: 1, // Error
          message: error.message 
        });
        dbSpan.recordException(error);
      } finally {
        dbSpan.end();
      }
    }

    // Add memory usage information
    const memoryUsage = process.memoryUsage();
    health.memory = {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
    };

    // Add attributes to the span
    span.setAttribute('health.status', health.status);
    span.setAttribute('health.uptime', process.uptime());
    
    return health;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ 
      code: 1, // Error
      message: error.message 
    });
    throw error;
  } finally {
    span.end();
  }
}

module.exports = { checkHealth };

# OpenTelemetry Instrumentation Guide

This document provides a comprehensive guide to the OpenTelemetry instrumentation implemented in this application.

## Overview

OpenTelemetry is an observability framework for cloud-native software that provides tools for collecting, processing, and exporting telemetry data (traces, metrics, and logs) to help you understand your software's behavior and performance.

In this application, we've implemented OpenTelemetry to provide:

- Distributed tracing across all API endpoints
- Custom spans for business operations
- Error tracking and reporting
- Health checks with trace context
- Correlation IDs for request tracking

## Architecture

The OpenTelemetry implementation follows a layered approach:

1. **Core SDK Setup** (`tracing.js`): Initializes the OpenTelemetry SDK with auto-instrumentation for HTTP and Express
2. **Application Integration** (`app.js`): Integrates OpenTelemetry at the application entry point
3. **Custom Instrumentation** (`controllers/UserController.js`): Adds business-specific spans and attributes
4. **Advanced Features** (`routes/index.js`, `utils/healthCheck.js`): Implements correlation IDs, health checks, and other advanced features

## Components

### 1. Core SDK Setup (`tracing.js`)

The central configuration file that initializes OpenTelemetry with:

- Service name and version identification
- Console exporter for development (configurable for production)
- Auto-instrumentation for HTTP and Express
- Custom span creation helper function
- Graceful shutdown handling

### 2. Application Integration (`app.js`)

- Initializes OpenTelemetry before other imports
- Adds global error handling middleware with trace context

### 3. Custom Instrumentation (`controllers/UserController.js`)

Each controller method is enhanced with:

- Custom spans with standardized naming (verb-noun format)
- Business-relevant attributes (user.id, operation.type, etc.)
- Error handling with span recording
- Status code management

### 4. Advanced Features

- **Health Check** (`utils/healthCheck.js`): Implements a health check utility with trace context
- **Correlation IDs** (`routes/index.js`): Adds correlation ID middleware for request tracking
- **Health Check Endpoint** (`routes/index.js`): Exposes a `/health` endpoint with trace context

## Naming Conventions

Following standardized naming conventions:

- **Service Name**: `user-api`
- **Span Names**: Verb-noun format (e.g., "Get Users", "Create User")
- **Attributes**:
  - HTTP attributes: `http.method`, `http.route`, `http.status_code`
  - Database attributes: `db.system`, `db.operation`
  - Business attributes: `user.id`, `operation.type`, etc.

## Configuration Options

The OpenTelemetry setup can be configured through environment variables:

- `NODE_ENV`: Set to "production" to use OTLP exporter instead of console exporter
- `OTEL_EXPORTER_OTLP_ENDPOINT`: Configure the OTLP endpoint (default: http://localhost:4318/v1/traces)

### OpenTelemetry Desktop Viewer Integration

The application is configured to send telemetry data to OpenTelemetry Desktop Viewer:

- **HTTP Protocol**: Traces are sent to `http://localhost:4318/v1/traces`
- **gRPC Protocol**: Uncomment the gRPC configuration in `tracing.js` to use `http://localhost:4317` instead

To use the OpenTelemetry Desktop Viewer:

1. Install and run the OpenTelemetry Desktop Viewer application
2. Start this application with `node app.js`
3. Generate traces by making requests to the API endpoints
4. View the traces in the OpenTelemetry Desktop Viewer interface

## Usage Examples

### Creating Custom Spans

```javascript
const { createSpan } = require('../tracing');

// Create a custom span with attributes
await createSpan('Operation Name', async () => {
  // Your code here
  const result = await someOperation();
  return result;
}, {
  'attribute.key': 'attribute.value',
  'operation.type': 'read'
});
```

### Adding Health Checks

```javascript
const { checkHealth } = require('../utils/healthCheck');

// Check health with database component
const health = await checkHealth({ database: sequelize });
```

## Troubleshooting

Common issues and solutions:

1. **Missing Spans**: Ensure that the OpenTelemetry SDK is initialized before other imports
2. **Incomplete Traces**: Check that error handling is properly implemented in all async operations
3. **Performance Issues**: Adjust batch span processor settings for production use

## Production Deployment

For production deployment:

1. Configure an OTLP exporter to send traces to your observability backend
2. Implement an appropriate sampling strategy based on traffic volume
3. Configure resource requirements based on application scale
4. Set up monitoring and alerting based on trace data

## Integration with Monitoring Systems

The OpenTelemetry traces can be integrated with:

- Jaeger
- Zipkin
- Prometheus (for metrics)
- ELK Stack
- Cloud provider observability services (AWS X-Ray, Google Cloud Trace, etc.)

## Best Practices

1. Always use the `createSpan` helper function for custom spans
2. Follow the naming conventions for spans and attributes
3. Ensure proper error handling in all instrumented code
4. Use correlation IDs for tracking requests across services
5. Regularly review and optimize the sampling strategy

## Future Enhancements

Potential future enhancements:

1. Add metrics collection for key performance indicators
2. Implement log correlation with traces
3. Add custom exporters for specific monitoring systems
4. Implement more granular sampling strategies

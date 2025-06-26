// OpenTelemetry instrumentation for Node.js
const { trace } = require('@opentelemetry/api');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor, BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');

// Create OTLP exporter for OpenTelemetry Desktop Viewer
const otlpExporter = new OTLPTraceExporter({
  // Configure for HTTP protocol to OpenTelemetry Desktop Viewer
  url: 'http://localhost:4318/v1/traces',
  // Uncomment for gRPC protocol
  // url: 'http://localhost:4317',
  // protocol: 'grpc',
});

// Configure the SDK with auto-instrumentation
const sdk = new NodeSDK({
  serviceName: 'user-api',
  // Use both Console and OTLP exporters
  spanProcessor: new BatchSpanProcessor(otlpExporter),
  // Also keep console exporter for debugging
  additionalSpanProcessors: [
    new SimpleSpanProcessor(new ConsoleSpanExporter())
  ],
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
      },
    }),
  ],
});

// Initialize the SDK
sdk.start();
console.log('OpenTelemetry SDK initialized');

// Handle shutdown gracefully
const shutdownHandler = async () => {
  try {
    await sdk.shutdown();
    console.log('OpenTelemetry SDK shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error shutting down OpenTelemetry SDK:', error);
    process.exit(1);
  }
};

// Register shutdown handlers
process.on('SIGTERM', shutdownHandler);
process.on('SIGINT', shutdownHandler);

// Helper function for creating custom spans
const createSpan = (name, fn, attributes = {}) => {
  const tracer = trace.getTracer('user-api');
  const currentSpan = tracer.startSpan(name);
  
  // Add custom attributes to the span
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      currentSpan.setAttribute(key, value);
    }
  });
  
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fn();
      currentSpan.setStatus({ code: 0 }); // Success
      currentSpan.end();
      resolve(result);
    } catch (error) {
      // Record error in the span
      currentSpan.recordException(error);
      currentSpan.setStatus({ code: 1, message: error.message }); // Error
      currentSpan.end();
      reject(error);
    }
  });
};

// Export the trace API for creating custom spans
module.exports = {
  trace,
  createSpan
};

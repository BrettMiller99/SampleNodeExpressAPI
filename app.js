// Initialize OpenTelemetry before importing other modules
require('./tracing');

const express = require('express');
const sequelize = require('./config/database');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', routes);

// Global error handling middleware with trace context
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  });
});

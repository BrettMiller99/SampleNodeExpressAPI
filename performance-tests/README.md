# Performance Testing Suite

This directory contains tools for measuring the performance of the SampleNodeExpressAPI application. These tests establish a baseline for performance before any optimizations are applied.

## Test Components

The performance testing suite consists of the following components:

1. **API Endpoint Tests** (`run-tests.js`): Tests all API endpoints using autocannon to measure throughput, latency, and other metrics.

2. **Database Performance Tests** (`db-monitor.js`): Measures the performance of various database operations including queries, inserts, updates, and deletes.

3. **Results Visualization** (`visualize-results.js`): Provides a simple ASCII visualization of test results for quick analysis.

4. **All-in-One Runner** (`run-all-tests.js`): Runs all tests in sequence and visualizes the results.

## Prerequisites

Before running the tests, make sure you have installed the required dependencies:

```bash
npm install --save-dev autocannon pino-pretty
```

## Running the Tests

### Option 1: Run All Tests

To run all tests in sequence:

1. Start the application server in a separate terminal:
   ```bash
   node app.js
   ```

2. Run the test suite:
   ```bash
   node performance-tests/run-all-tests.js
   ```

### Option 2: Run Individual Tests

You can also run each test separately:

- For API endpoint tests:
  ```bash
  node performance-tests/run-tests.js
  ```

- For database performance tests:
  ```bash
  node performance-tests/db-monitor.js
  ```

- To visualize the latest results:
  ```bash
  node performance-tests/visualize-results.js
  ```

## Test Results

All test results are saved in the `performance-tests/results` directory:

- API endpoint test results are saved as individual JSON files for each endpoint
- A summary of all API tests is saved as `summary_[timestamp].json`
- Database performance results are saved as `db_performance_[timestamp].json`

## Interpreting Results

The visualization script provides a simple ASCII chart showing:

1. **API Endpoint Performance**: Requests per second for each endpoint
2. **API Endpoint Latency**: Average response time in milliseconds
3. **Database Query Performance**: Average execution time in milliseconds

These metrics serve as a baseline for measuring the impact of future optimizations.

## Notes

- The API tests use a fixed number of connections (10) and duration (10 seconds) by default. You can modify these in `run-tests.js`.
- Database tests run each query multiple times (10 iterations by default) with a warmup period to ensure accurate measurements.
- For more detailed analysis, examine the raw JSON result files.

## Future Optimization Opportunities

When optimizing this codebase in the future, consider the following areas:

1. **Database Operations**:
   - The `delete` operation shows significantly higher latency (~2.56 ms) compared to other database operations
   - Analyze query execution plans for complex queries
   - Consider adding or optimizing indexes for frequently queried fields

2. **API Endpoints**:
   - Analyze endpoints with higher latency
   - Look for N+1 query patterns
   - Consider caching frequently accessed data
   - Evaluate connection pooling configuration

3. **Monitoring Methodology**:
   - Run tests with varying levels of concurrency to identify bottlenecks under load
   - Monitor memory usage during tests
   - Track changes in performance metrics over time as optimizations are applied

Remember to follow the optimization rules:
- Always collect performance data before implementing optimizations
- Identify specific bottlenecks rather than making general optimizations
- Validate improvements with before/after comparisons
- Focus on database query efficiency and asynchronous operation patterns

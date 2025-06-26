---
description: This workflow analyzes OpenTelemetry trace data to identify performance bottlenecks in API endpoints and generates targeted optimizations.
---

Collect trace data for analysis:
     - Identify endpoints to analyze through OpenTelemetry trace data or user specification
     - Filter trace data by endpoint, time range, and error status
     - Calculate key metrics like p95/p99 latency, error rate, and frequency
Identify performance bottlenecks:
     - Analyze span durations to find the slowest operations
     - Detect unusual patterns like sequential database queries that could be parallelized
     - Identify high-frequency operations that could benefit from caching
     - Detect n+1 query patterns in data access code
Generate targeted optimizations:
     - Create optimized implementations of slow controller methods
     - Suggest database query optimizations like index creation or query restructuring
     - Recommend caching strategies for frequently accessed, rarely changed data
     - Suggest parallelization for independent operations
Implement optimizations:
     - Apply recommended changes to the codebase
     - Preserve all business logic and error handling
     - Ensure backward compatibility with existing interfaces
     - Add comments explaining performance optimizations
Verify improvements:
     - Generate code to retest the optimized endpoints
     - Calculate expected performance improvements
     - Suggest monitoring strategies for ongoing performance tracking

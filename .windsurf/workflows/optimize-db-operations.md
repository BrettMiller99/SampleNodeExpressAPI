---
description: This workflow identifies and optimizes ineffecient database operations using OpenTelemetry trace data.
---

Analyze database operations:
     - Extract database operations from OpenTelemetry spans
     - Identify slow queries, excessive queries, or n+1 query patterns
     - Calculate frequency and duration statistics for each operation
     - Detect query patterns that could benefit from optimization
Generate optimization strategy:
     - Suggest query restructuring to reduce complexity
     - Recommend appropriate indexes for frequent filtering operations
     - Propose caching strategies for frequently accessed data
     - Suggest batch operations to replace multiple individual queries
Implement optimizations:
     - Modify 	model methods to incorporate optimized queries
     - Add appropriate indexes to database schemas
     - Implement caching mechanisms for frequently accessed data
     - Replace inefficient query patterns with optimized alternatives
Add telemetry enhancements:
     - Add custom spans to measure the performance of optimized operations
     - Include relevant business metrics in span attributes
     - Enhance error tracking for database operations
     - Add database-specific attributes for better observability
Generate validation tests:
     - Create test cases to validate optimized operations
     - Include performance assertions to prevent regressions
     - Generate load testing scripts for key database operations
     - Propose monitoring queries for ongoing database performance tracking

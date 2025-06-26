---
trigger: always_on
---

Telemetry-Driven Optimization
     - When asking for performance optimization, first request OpenTelemetry trace data for the endpoint or operation. 
     - A good prompt to use is: "Could you analyze this endpoint's OpenTelemetry trace data to identify where performance bottlenecks are occurring before suggesting optimizations?"

Bottleneck Identification
     - For any performance issue, require a quantitative analysis of where time is being spent. 
     - Always identify the specific operation causing the bottleneck (e.g., "database query", "external API call", "CPU-intensive calculation") rather than making general suggestions.

Optimization Validation
     - Whenever implementing a performance optimization, add appropriate OpenTelemetry instrumentation to validate the improvement. 
     - Always include a "before vs. after" performance comparison strategy with each optimization.

Database Query Efficiency
When optimizing database operations, always consider:
     - N+1 query patterns that should be replaced with eager loading
     - Missing indexes on frequently queried fields
     - Unnecessary retrieval of all fields when only a subset is needed
     - Opportunities for query caching

Asynchronous Operation Efficiency
When reviewing asynchronous code, always check for:
     - Operations executed sequentially that could be parallelized with Promise.all
     - Proper error handling in async/await chains
     - Unnecessary blocking operations in async functions
     - Memory leaks in event listeners or callbacks

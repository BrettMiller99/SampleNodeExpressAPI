---
description: This workflow automatically creates comprehensive test cases for your SQL queries, validating their correctness across various scenarios.
---

1. Identify the SQL query to test:
   - Search codebase for SQL queries in repository/data access files
   - Present found queries to user for selection
   - Alternatively, accept a newly created query from a previous workflow

2. Analyze query structure and semantics:
   - Parse the SQL query to understand its components
   - Identify tables, joins, conditions, and projections
   - Determine test-critical paths (WHERE clauses, JOINs, GROUP BYs)

3. Generate test fixtures:
   - Create test data generation scripts for each table in the query
   - Ensure test data covers edge cases (NULL values, empty results, maximum values)
   - Include data that tests boundary conditions in WHERE clauses
   - Generate fixtures for each JOIN relationship

4. Create test cases:
   - Happy path test with typical data
   - Edge case tests for each WHERE condition
   - Null handling tests
   - Performance tests with larger datasets
   - Tests for each JOIN condition

5. Set up mock database environment:
   - Generate schema creation scripts
   - Include test data insertion scripts
   - Add cleanup scripts to restore state between tests

6. Implement automated tests:
   - Create test runners appropriate for the project's tech stack
   - Include setup and teardown procedures
   - Add result validation checks
   - Implement performance benchmarking if needed

7. Execute the tests:
   - Run the tests against the mock database
   - Collect test results and metrics
   - Report on test coverage
   - Identify any failing conditions

8. Generate test documentation:
   - Create a summary of test scenarios
   - Document test fixtures and their purpose
   - Explain test coverage
   - Provide instructions for extending tests for future query modifications

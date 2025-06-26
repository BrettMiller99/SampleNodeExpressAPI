---
description: This workflow automatically analyzes and optimizes an existing SQL query fro the codebase, identifying performance bottlenecks and implementing improvements with minimal user intervention. 
---

1. Locate SQL queries in the codebase:
   - Search repository for files containing SQL queries (.sql files, database utility files, repository files)
   - Prioritize queries with performance indicators (JOINs, subqueries, multiple WHEREs)
   - Present found queries to user for selection

2. Extract database schema automatically:
   - Analyze migration files, schema definitions, or entity models in the codebase
   - If schema files are unavailable, infer schema from query structure and variable names
   - Build a schema representation adequate for query analysis

3. Analyze the selected query for inefficiencies:
   - Identify subqueries that could be rewritten as JOINs
   - Detect unindexed WHERE clauses
   - Find costly full table scans
   - Locate function calls on indexed columns
   - Check for inefficient LIKE expressions with leading wildcards

4. Generate optimization recommendations:
   - Create an optimized version of the query
   - Rewrite complex subqueries as JOINs or CTEs
   - Recommend appropriate indexes
   - Simplify complex expressions
   - Reorder operations for better performance

5. Create a detailed explanation of optimizations:
   - Highlight each change with before/after code snippets
   - Explain performance benefit of each modification
   - Provide complexity analysis where applicable

6. Implement the optimizations in the codebase:
   - Locate the original query in source files
   - Replace with the optimized version
   - Add appropriate comments explaining the optimization
   - Maintain compatibility with surrounding code
   - Ensure any variable references remain intact

7. Generate index creation scripts if needed:
   - Create appropriate SQL statements for recommended indexes
   - Include execution instructions for various database systems
   - Add explanatory comments for each index purpose

8. Verify query equivalence:
   - Check that the optimized query returns the same result set
   - Confirm all business logic is preserved
   - Ensure no semantic changes to the query intention

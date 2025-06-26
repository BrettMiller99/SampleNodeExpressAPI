---
description: This workflow automatically translate natural language descriptions into optimized SQL queries by analyzing your DB structure and generating prod-ready SQL, with minimal user input.
---

1. Parse the natural language request:
   - Extract key entities from the description (e.g., "customers", "orders")
   - Identify operations (e.g., "find", "count", "average")
   - Determine filtering conditions (e.g., "in the last month", "with status active")
   - Recognize sorting requirements (e.g., "ordered by date", "highest first")
   - Detect aggregation needs (e.g., "total sales", "average revenue")

2. Discover database structure:
   - Search codebase for schema definitions, migrations, or model files
   - Extract table names, columns, relationships, and constraints
   - If schema files unavailable, analyze existing SQL queries to infer structure
   - Build a workable representation of the database schema

3. Map natural language concepts to database elements:
   - Match entities to tables (e.g., "customers" → customers table)
   - Connect attributes to columns (e.g., "email" → email column)
   - Link operations to SQL functions (e.g., "average" → AVG())
   - Translate time references to date operations

4. Generate SQL query components:
   - Construct SELECT clause with required columns
   - Build FROM clause with necessary tables
   - Create JOIN conditions based on relationships
   - Develop WHERE clause from filtering criteria
   - Add GROUP BY for aggregations
   - Include HAVING for group filters
   - Construct ORDER BY from sorting requirements
   - Add LIMIT/OFFSET for pagination if needed

5. Optimize the generated query:
   - Add appropriate indexes for common query patterns
   - Use CTEs for complex subqueries
   - Ensure efficient JOIN order
   - Verify indexes will be used
   - Avoid function calls on indexed columns

6. Generate the final SQL query:
   - Format the SQL for readability with consistent indentation
   - Add comments explaining complex parts
   - Include parameter placeholders for dynamic values
   - Ensure compatibility with the target database system

7. Create implementation code:
   - Generate the code to execute the query in the project's language
   - Add parameter binding for security
   - Include error handling
   - Add appropriate logging
   - Format results according to application needs

8. Document the query:
   - Create a summary of what the query does
   - Explain performance characteristics
   - Document parameters and their purpose
   - Note any assumptions made during generation

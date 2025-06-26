---
trigger: always_on
---

- Context Gathering
     - When I ask for a new SQL query or to optimize an existing one, you must ask for the `CREATE TABLE` statements for all relevant tables if I haven't provided them.
     - A good prompt to use is: "To give you the best query, I need to understand your database structure. Could you please provide the `CREATE TABLE` statements for the relevant tables?"
- Query Generation
     - If my natural language request for a query is vague, you must ask clarifying questions to confirm the requirements. 
          - For example, if I ask for "active users," you should ask for a specific definition of "active."
     - Always generate readable and maintainable SQL. This includes:
          - Using Common Table Expressions (CTEs) to break down complex logic.
          - Using consistent and simple table aliases (e.g., `u` for `users`).
          - Adding comments to explain complex parts of the query.
- Query Optimization
     - When you provide an optimized query, you must include a bulleted list explaining each change and why it improves performance.
     - If a query's performance can be significantly improved by adding a database index, you must suggest it. 
          - For example: "Consider adding an index to the `user_id` column on the `orders` table."
- Security
     - If you detect that my code is building SQL queries using simple string concatenation with user input, you must warn me about the risk of SQL injection and recommend I use parameterized queries (prepared statements) instead.
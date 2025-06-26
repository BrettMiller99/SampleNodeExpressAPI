# Database Schema Changes

## 1 · Problem Statement

Database schema changes are a critical yet challenging aspect of application development. As applications evolve, their data models must adapt to support new features, improve performance, or fix design issues. However, implementing schema changes safely across environments presents significant complexity. Organizations need to modify database structures without data loss, service disruption, or breaking existing functionality. This process typically involves creating migration scripts, updating application code to work with the new schema, ensuring backward compatibility during deployment, and validating data integrity—all while maintaining system availability. The complexity increases exponentially in distributed systems with multiple services sharing database resources, where coordinated changes must be carefully orchestrated to prevent cascading failures.

## 2 · Key Challenges

- **Migration Safety and Data Integrity:** Ensuring schema changes don't result in data loss or corruption, particularly when transforming existing data to fit new structures.
- **Deployment Coordination:** Synchronizing database changes with application code updates to maintain system functionality throughout the deployment process.
- **Backward Compatibility:** Supporting both old and new schema versions during transitional periods to enable gradual rollouts and potential rollbacks.
- **Testing Complexity:** Creating comprehensive test scenarios that verify both the migration process and application behavior with the new schema.
- **Performance Impact:** Managing the performance implications of schema changes, especially for large tables where operations like adding columns or indexes can cause significant downtime.
- **Dependency Management:** Identifying and updating all code paths affected by schema changes, including reports, APIs, and integrations that may break.
- **Version Control:** Tracking schema changes alongside code changes in version control systems to maintain a complete history of the database evolution.
- **Environment Parity:** Ensuring consistent schema changes across development, testing, and production environments to prevent environment-specific bugs.

## 3 · Tasks Windsurf can help accelerate

- **Automated Schema Analysis and Migration Generation:** Windsurf can significantly accelerate database schema changes by analyzing the current database structure and automatically generating appropriate migration scripts. Using Cascade's capabilities, it can identify the safest migration path, suggest proper data transformations, and create idempotent scripts that can be safely run multiple times. This reduces the risk of errors and ensures consistent schema changes across all environments.
- **Intelligent Code Refactoring:** When database schemas change, application code must be updated to work with the new structure. Windsurf can automatically identify all code locations affected by schema changes and suggest or implement the necessary updates. It can detect references to modified tables or columns throughout the codebase, update SQL queries, and refactor ORM models to maintain compatibility with the new schema.
- **Comprehensive Impact Analysis:** Before implementing schema changes, Windsurf can perform a thorough impact analysis to identify potential risks and dependencies. It can map out all application components that interact with the affected database objects, estimate downtime requirements, and suggest mitigation strategies for high-risk changes. This helps developers make informed decisions about how and when to implement changes.
- **Documentation Generation:** Windsurf can automatically generate comprehensive documentation for schema changes, including entity-relationship diagrams, change logs, and rollback procedures. This documentation helps team members understand the database evolution and provides critical reference information for troubleshooting and future development.
- **Migration Testing Automation:** Windsurf can help create and execute test cases that verify both the migration process and application functionality with the new schema. It can generate test data that exercises edge cases, simulate migration failures, and validate data integrity after migration. This comprehensive testing reduces the risk of unexpected issues in production.

By leveraging these capabilities, Windsurf transforms database schema management from a high-risk, manual process into a streamlined, reliable workflow. The result is faster, safer database evolution that supports continuous delivery without compromising data integrity or application stability.

---

## Recommended Workflow

### /update-schema Workflow

**Description:** This workflow guides Cascade through a comprehensive process for implementing database schema changes safely and effectively.

**1. Analyze Current Schema**
When initiating the workflow, Cascade will:
- Perform a deep analysis of the existing database schema, identifying:
  - Tables, columns, and their data types
  - Relationships and constraints
  - Indexes and their usage patterns
  - Table sizes and growth patterns (when available)
- Examine how the application code interacts with the database:
  - Identify ORM models and their properties
  - Analyze queries and data access patterns
  - Map relationships between models
  - Identify validation rules and business logic
- Identify any existing migration mechanisms or patterns used in the project:
  - Migration framework in use (if any)
  - Directory structure for migrations
  - Naming conventions for migration files
  - Migration execution process

*Example prompt:*
```
/update-schema I need to add user profile information (age, address, phone) to our User model and rename the 'name' field to 'fullName'.
```

**2. Propose Schema Changes**
Based on requirements and analysis, Cascade will create a detailed schema change plan that includes:
- Specific changes to make:
  - New tables/columns to be added
  - Modified fields (renames, type changes, constraint changes)
  - New relationships or constraints
  - Changes to indexes
- Migration strategy with step-by-step implementation approach:
  - Sequence of migration files to create
  - Order of operations to minimize risk
  - Handling of existing data
- Required code changes to support the new schema:
  - Updates to ORM models
  - Changes to queries and data access code
  - Updates to validation logic
  - UI changes to support new fields
- Data transformation logic for existing records:
  - How to populate new fields
  - How to handle data type conversions
  - Validation of transformed data
- Estimated impact on application performance and functionality:
  - Potential downtime requirements
  - Performance implications of schema changes
  - Backward compatibility considerations

*Example plan output:*
```markdown
## Schema Change Plan: Add User Profile Information

### 1. Database Changes
- Add columns to Users table:
  - age (INTEGER, nullable)
  - address (STRING, nullable)
  - phone (STRING, nullable)
- Rename column 'name' to 'fullName'

### 2. Migration Strategy
1. Create migration file '001_add_user_profile_fields.js'
   - Add new columns (age, address, phone)
2. Create migration file '002_rename_name_to_fullName.js'
   - Add fullName column (nullable initially)
   - Copy data from name to fullName
   - Update fullName to be non-nullable
   - Remove name column

### 3. Code Changes
- Update User model to include new fields
- Modify UserController methods to handle new fields
- Update validation logic in routes
- Update tests to verify new fields

### 4. Data Transformation
- No complex transformations needed
- Simple copy from name to fullName

### 5. Impact Assessment
- Minimal downtime required
- No performance concerns identified
- Will require application restart after migration
```

**3. Request User Approval**
Before proceeding with implementation, Cascade will:
- Present the complete plan for review, including visual representations of before/after schema when possible
- Highlight potential risks or areas requiring special attention
- Explicitly ask for approval: "Does this schema change plan look good to you? Shall I proceed with implementation?"
- Wait for explicit approval before proceeding

**4. Implement Changes**
Once approved, Cascade will execute the plan by:
- Creating migration scripts following project conventions:
  - Properly versioned and named
  - Including both up and down methods
  - Implementing data transformation logic
  - Adding appropriate error handling
- Updating ORM models to reflect the new schema:
  - Adding new fields with proper types and constraints
  - Updating validation rules
  - Modifying relationships if needed
- Modifying application code to work with the updated schema:
  - Updating controllers to handle new fields
  - Modifying service layer logic
  - Updating API responses to include new fields
- Adding data validation to ensure integrity:
  - Input validation for new fields
  - Consistency checks for transformed data
  - Error handling for constraint violations
- Updating tests to verify functionality:
  - Unit tests for model changes
  - Integration tests for API endpoints
  - Migration tests to verify data integrity

*Example implementation:*
```javascript
// migrations/001_add_user_profile_fields.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'address', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'age');
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'phone');
  }
};
```

**5. Verify Changes**
After implementation, Cascade will:
- Run migrations in a test environment:
  - Execute migration scripts
  - Verify schema changes were applied correctly
  - Check for any errors or warnings
- Execute tests to verify application functionality:
  - Run existing test suite to ensure no regressions
  - Execute new tests specific to schema changes
  - Test API endpoints with new schema
- Validate data integrity after migration:
  - Verify data was transformed correctly
  - Check constraints are enforced properly
  - Ensure relationships work as expected
- Document the changes and provide a summary:
  - List of files modified
  - Summary of schema changes implemented
  - Instructions for deployment
  - Rollback procedure if needed

*Example verification steps:*
```
1. Run migrations:
   npx sequelize-cli db:migrate

2. Verify schema changes:
   - Check Users table structure
   - Confirm new columns exist with correct types
   - Verify name column was renamed to fullName

3. Run tests:
   npm test

4. Manual verification:
   - Start application: npm start
   - Create user with profile information
   - Retrieve user and verify profile data
   - Update user profile and verify changes
```

### Best Practices for Using This Workflow

- **Be Specific in Requirements:** Clearly describe what schema changes you need and why. Include any specific constraints or requirements.
- **Review Plans Carefully:** Take time to review the proposed plan before approving implementation. Pay special attention to data transformation steps and potential risks.
- **Test in Development First:** Always run migrations in development or staging environments before applying to production.
- **Keep Backups:** Ensure you have database backups before running migrations in production.
- **Monitor Performance:** After schema changes, monitor application performance to identify any unexpected issues.
- **Document Changes:** Maintain documentation of schema changes for future reference and onboarding.

### Recommended Rules

- **Version All Schema Changes:** All database changes must be implemented as versioned migration scripts (e.g., `001_add_user_profile.js`, `002_rename_email_column.js`). Never modify existing migration files after they've been committed to version control.
- **One-Way Migrations with Rollback Plans:** Design migrations to be one-way (forward only) but always include a documented rollback procedure for emergencies. Test both the migration and its rollback before deploying to production.
- **Incremental Changes Only:** Break complex schema changes into smaller, incremental changes that can be deployed independently. For example, instead of renaming a column in one step, add the new column, update code to use both columns, migrate data, then remove the old column.
- **Preserve Data Integrity:** Every migration must include data transformation logic when schema changes affect existing data. Always validate data before and after migration to ensure integrity is maintained.
- **Coordinate Code and Schema Changes:** Deploy schema changes and corresponding code updates together in a coordinated manner. Use feature flags to decouple feature releases from schema changes when necessary.

---

## 4 · Video Script

**Set-up:**
- **Model used when testing script:** Claude 3.7 Sonnet
- **Planning Mode turned OFF**
- **Note:** The repo includes the rule + workflow file already. This video might need to be sped up, the migration can take a second.
- **Application utilized to view SQLite DB:** [https://sqlitebrowser.org/dl/](https://sqlitebrowser.org/dl/)

**(0:00-0:20) Introduction**
[Scene: Windsurf IDE is open, showing the SampleNodeExpressAPI project.]

**Narrator:** "Database schema changes are critical for evolving applications but can be risky and complex. In this video, we'll show you how Cascade, your agentic AI coding assistant, can help you implement database schema changes safely and efficiently—not just by writing migration scripts, but by helping you plan, implement, and verify schema changes with minimal risk."

**(0:20-1:00) Step 1: Analysis and Planning**
[Scene: The user types their initial, high-level goal into the Cascade chat.]

**Narrator:** "We'll start by giving Cascade our goal. We want to enhance our user model by adding profile information, but we're not sure of the best approach. We'll ask it to analyze the current schema and propose a plan."

*Prompt on screen:*
```
I need to enhance our User model by adding profile information like age, address, and phone number. I also want to rename the 'name' field to 'fullName' for clarity. Analyze the current schema and propose a plan for these changes.
```

[Scene: Show Cascade's tool calls exploring the codebase and the resulting plan being created and displayed.]

**Narrator:** "Cascade immediately explores the project, analyzing the current database schema and how the application interacts with it. It creates a clear, actionable plan that includes creating migration scripts, updating the User model, modifying controllers, and ensuring data integrity during the transition. The plan looks great, so let's execute it."

**(1:00-2:00) Step 2: Implementing Schema Changes**
[Scene: A rapid sequence showing Cascade's actions. Creating migration files, updating the User model, modifying controllers to use the new fields, and updating tests.]

**Narrator:** "Now, we'll execute the plan. Cascade creates migration scripts that safely add new columns and rename existing ones. It updates the User model to include the new fields and adds proper validation. It then modifies all controllers and routes that interact with user data to accommodate the new schema. Finally, it updates tests to verify everything works correctly with the new structure."

**(1:45-2:30) Step 3: Verification and the "Aha!" Moment**
[Scene: The user asks Cascade to test the newly updated application.]

**Narrator:** "With the schema changes complete, let's test the application to ensure everything works as expected."

*Prompt on screen:*
```
Test the application with the new schema changes to verify everything works correctly.
```

[Scene: Cascade runs the migrations, starts the server, and tests the API endpoints with the new schema.]

**Note:** Depending on how the migration is enforced, it should be relatively consistent given the rules+workflow; a test error might be encountered. Cascade should reason through this. Could spin another talk-track here - “Cascade is smart enough to recognize and resolve XYZ, this is why you should always test” etc.

**Narrator:** "Cascade runs the migrations, which execute flawlessly. It then starts the server and tests the API endpoints, creating users with the new profile fields and verifying that the renamed 'fullName' field works correctly. Let's look at the database to see the changes."

**(2:30-3:00) Step 4: The Complete Picture**
[Scene: Switch to DB Browser for SQLite showing the updated database schema with the new columns and renamed field.]

**Narrator:** "And there it is! Our database schema has been successfully updated with the new profile fields, and the 'name' field has been renamed to 'fullName'. All our application code has been updated to work with these changes, and our tests confirm everything is functioning correctly. This is the power of combining a clear plan with automated execution through Cascade."

**(3:00-3:15) Conclusion**
[Scene: Quickly scroll through the modified files, showing the clean, well-structured code. End on the Windsurf logo.]

**Narrator:** "In just a few minutes, we went from a simple schema change request to a fully implemented and tested solution. Cascade didn't just write code; it understood our goal, created a comprehensive plan that minimized risk, and executed it perfectly. That's the power of Cascade."

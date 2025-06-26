---
description: This workflow will be useful in assisting with a DB Migration change
---

# Database Schema Change Workflows

This document outlines recommended workflows for implementing database schema changes safely and effectively using Cascade, your agentic AI coding assistant.

## /update-schema Workflow

This workflow guides Cascade through a comprehensive process for implementing database schema changes safely and effectively.

### 1. Analyze Current Schema

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

**Example prompt:**
```
/update-schema I need to add user profile information (age, address, phone) to our User model and rename the 'name' field to 'fullName'.
```

### 2. Propose Schema Changes

Based on requirements and analysis, Cascade will create a detailed schema change plan that includes:

- **Specific changes to make:**
  - New tables/columns to be added
  - Modified fields (renames, type changes, constraint changes)
  - New relationships or constraints
  - Changes to indexes

- **Migration strategy with step-by-step implementation approach:**
  - Sequence of migration files to create
  - Order of operations to minimize risk
  - Handling of existing data

- **Required code changes to support the new schema:**
  - Updates to ORM models
  - Changes to queries and data access code
  - Updates to validation logic
  - UI changes to support new fields

- **Data transformation logic for existing records:**
  - How to populate new fields
  - How to handle data type conversions
  - Validation of transformed data

- **Estimated impact on application performance and functionality:**
  - Potential downtime requirements
  - Performance implications of schema changes
  - Backward compatibility considerations

**Example plan output:**
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

### 3. Request User Approval

Before proceeding with implementation, Cascade will:

- Present the complete plan for review, including visual representations of before/after schema when possible
- Highlight potential risks or areas requiring special attention
- Explicitly ask for approval: "Does this schema change plan look good to you? Shall I proceed with implementation?"
- Wait for explicit approval before proceeding

### 4. Implement Changes

Once approved, Cascade will execute the plan by:

- **Creating migration scripts following project conventions:**
  - Properly versioned and named
  - Including both up and down methods
  - Implementing data transformation logic
  - Adding appropriate error handling

- **Updating ORM models to reflect the new schema:**
  - Adding new fields with proper types and constraints
  - Updating validation rules
  - Modifying relationships if needed

- **Modifying application code to work with the updated schema:**
  - Updating controllers to handle new fields
  - Modifying service layer logic
  - Updating API responses to include new fields

- **Adding data validation to ensure integrity:**
  - Input validation for new fields
  - Consistency checks for transformed data
  - Error handling for constraint violations

- **Updating tests to verify functionality:**
  - Unit tests for model changes
  - Integration tests for API endpoints
  - Migration tests to verify data integrity

**Example implementation:**
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

### 5. Verify Changes

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

**Example verification steps:**
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

## Best Practices for Using This Workflow

1. **Be Specific in Requirements:**
   Clearly describe what schema changes you need and why. Include any specific constraints or requirements.

2. **Review Plans Carefully:**
   Take time to review the proposed plan before approving implementation. Pay special attention to data transformation steps and potential risks.

3. **Test in Development First:**
   Always run migrations in development or staging environments before applying to production.

4. **Keep Backups:**
   Ensure you have database backups before running migrations in production.

5. **Monitor Performance:**
   After schema changes, monitor application performance to identify any unexpected issues.

6. **Document Changes:**
   Maintain documentation of schema changes for future reference and onboarding.
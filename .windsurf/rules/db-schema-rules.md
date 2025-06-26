---
trigger: always_on
---

# Database Schema Change Rules

This document outlines the core rules for implementing database schema changes safely and effectively in our projects. Following these rules helps ensure data integrity, minimize downtime, and maintain application stability during schema evolution.

## 1. Version All Schema Changes

**Rule:** All database changes must be implemented as versioned migration scripts (e.g., `001_add_user_profile.js`, `002_rename_email_column.js`).

**Implementation:**
- Use sequential numbering or timestamps for migration files
- Include descriptive names that clearly indicate the purpose of each migration
- Never modify existing migration files after they've been committed to version control
- Store all migrations in a dedicated `/migrations` directory

**Example:**
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'age');
    await queryInterface.removeColumn('Users', 'address');
  }
};
```

## 2. One-Way Migrations with Rollback Plans

**Rule:** Design migrations to be one-way (forward only) but always include a documented rollback procedure for emergencies.

**Implementation:**
- Implement both `up` and `down` methods in migration scripts
- Test both the migration and its rollback before deploying to production
- Document any manual steps required for complete rollback
- For complex migrations, create a separate rollback test environment

**Example:**
```javascript
// migrations/002_rename_name_to_fullName.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'name', 'fullName');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'fullName', 'name');
  }
};
```

## 3. Incremental Changes Only

**Rule:** Break complex schema changes into smaller, incremental changes that can be deployed independently.

**Implementation:**
- For column renames: add new column → update code to use both → migrate data → remove old column
- For table restructuring: create new table → dual-write to both → migrate data → switch reads to new table → remove old table
- Deploy each step separately with appropriate verification

**Example for renaming a column:**
1. Migration 1: Add new column
```javascript
await queryInterface.addColumn('Users', 'fullName', {
  type: Sequelize.STRING,
  allowNull: true
});
```

2. Application code update: Write to both columns
```javascript
// When creating/updating users
user.name = userData.name;
user.fullName = userData.name;
```

3. Migration 2: Copy data from old to new column
```javascript
await queryInterface.sequelize.query(
  'UPDATE Users SET fullName = name WHERE fullName IS NULL'
);
```

4. Application code update: Read from new column
```javascript
// Update all queries to use fullName instead of name
```

5. Migration 3: Make new column non-nullable
```javascript
await queryInterface.changeColumn('Users', 'fullName', {
  type: Sequelize.STRING,
  allowNull: false
});
```

6. Migration 4: Remove old column
```javascript
await queryInterface.removeColumn('Users', 'name');
```

## 4. Preserve Data Integrity

**Rule:** Every migration must include data transformation logic when schema changes affect existing data.

**Implementation:**
- Include data migration steps within schema migration scripts
- Add validation to ensure data meets new constraints
- Create backups before running migrations that transform data
- Log summary statistics before and after migration for verification

**Example:**
```javascript
// migrations/003_normalize_phone_numbers.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new column with constraints
    await queryInterface.addColumn('Users', 'normalizedPhone', {
      type: Sequelize.STRING(15),
      allowNull: true
    });
    
    // Transform existing data
    const users = await queryInterface.sequelize.query(
      'SELECT id, phone FROM Users WHERE phone IS NOT NULL',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    for (const user of users) {
      // Simple normalization example (remove non-digits)
      const normalizedPhone = user.phone.replace(/\D/g, '');
      await queryInterface.sequelize.query(
        'UPDATE Users SET normalizedPhone = ? WHERE id = ?',
        { replacements: [normalizedPhone, user.id] }
      );
    }
    
    // Log summary for verification
    console.log(`Normalized phone numbers for ${users.length} users`);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'normalizedPhone');
  }
};
```

## 5. Coordinate Code and Schema Changes

**Rule:** Deploy schema changes and corresponding code updates together in a coordinated manner.

**Implementation:**
- Use feature flags to decouple feature releases from schema changes when necessary
- Implement backward-compatible code that works with both old and new schemas during transition
- Follow a specific deployment sequence: schema changes first, then code changes
- For critical systems, use blue-green deployments to minimize risk

**Example using feature flags:**
```javascript
// Feature flag configuration
const FEATURES = {
  USE_USER_PROFILES: process.env.FEATURE_USER_PROFILES === 'true'
};

// In controller code
async function getUserProfile(req, res) {
  const user = await User.findByPk(req.params.id);
  
  if (FEATURES.USE_USER_PROFILES) {
    // New schema with profile fields
    return res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      address: user.address,
      phone: user.phone
    });
  } else {
    // Old schema compatibility
    return res.json({
      id: user.id,
      name: user.fullName || user.name, // Support both fields during transition
      email: user.email
    });
  }
}
```

By following these rules consistently, we can ensure that our database schema evolves safely while maintaining application stability and data integrity.

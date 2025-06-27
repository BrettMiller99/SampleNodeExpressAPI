const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Configuration
const config = {
  queries: [
    {
      name: 'findAll',
      fn: async () => {
        const [results, metadata] = await sequelize.query('SELECT * FROM Users');
        return results.length;
      }
    },
    {
      name: 'findOne',
      fn: async () => {
        const [results, metadata] = await sequelize.query('SELECT * FROM Users WHERE id = 1');
        return results.length;
      }
    },
    {
      name: 'count',
      fn: async () => {
        const [results, metadata] = await sequelize.query('SELECT COUNT(*) as count FROM Users');
        return results[0].count;
      }
    },
    {
      name: 'insert',
      fn: async () => {
        const email = `test-${Date.now()}@example.com`;
        const [results, metadata] = await sequelize.query(
          `INSERT INTO Users (name, email, createdAt, updatedAt) VALUES ('Test User', '${email}', datetime('now'), datetime('now'))`
        );
        return metadata;
      }
    },
    {
      name: 'update',
      fn: async () => {
        const [results, metadata] = await sequelize.query(
          `UPDATE Users SET name = 'Updated Name', updatedAt = datetime('now') WHERE id = (SELECT id FROM Users ORDER BY id DESC LIMIT 1)`
        );
        return metadata;
      }
    },
    {
      name: 'delete',
      fn: async () => {
        const [results, metadata] = await sequelize.query(
          `UPDATE Users SET deletedAt = datetime('now') WHERE id = (SELECT id FROM Users ORDER BY id DESC LIMIT 1)`
        );
        return metadata;
      }
    },
    {
      name: 'complexQuery',
      fn: async () => {
        const [results, metadata] = await sequelize.query(`
          SELECT 
            u.id, 
            u.name, 
            u.email,
            u.createdAt,
            u.updatedAt,
            u.deletedAt
          FROM Users u
          WHERE u.deletedAt IS NULL
          ORDER BY u.createdAt DESC
          LIMIT 10
        `);
        return results.length;
      }
    }
  ],
  iterations: 10, // Number of times to run each query
  warmup: 2       // Number of warmup iterations before measuring
};

// Function to run a single query test
async function runQueryTest(query) {
  console.log(`Testing query: ${query.name}`);
  
  // Warmup runs
  for (let i = 0; i < config.warmup; i++) {
    await query.fn();
  }
  
  const times = [];
  
  // Measured runs
  for (let i = 0; i < config.iterations; i++) {
    const start = performance.now();
    await query.fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  // Calculate statistics
  const total = times.reduce((sum, time) => sum + time, 0);
  const avg = total / times.length;
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];
  const min = times[0];
  const max = times[times.length - 1];
  const p95 = times[Math.floor(times.length * 0.95)];
  
  return {
    query: query.name,
    iterations: config.iterations,
    averageMs: avg,
    medianMs: median,
    minMs: min,
    maxMs: max,
    p95Ms: p95,
    allTimes: times
  };
}

// Run all query tests
async function runAllTests() {
  console.log('Starting database performance tests...\n');
  
  const results = [];
  
  for (const query of config.queries) {
    try {
      const result = await runQueryTest(query);
      results.push(result);
      
      console.log(`\nResults for ${query.name}:`);
      console.log(`  Average: ${result.averageMs.toFixed(2)} ms`);
      console.log(`  Median: ${result.medianMs.toFixed(2)} ms`);
      console.log(`  Min: ${result.minMs.toFixed(2)} ms`);
      console.log(`  Max: ${result.maxMs.toFixed(2)} ms`);
      console.log(`  P95: ${result.p95Ms.toFixed(2)} ms`);
    } catch (err) {
      console.error(`Error testing query ${query.name}:`, err);
    }
  }
  
  // Ensure results directory exists
  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // Save results to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(resultsDir, `db_performance_${timestamp}.json`);
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  
  console.log(`\nAll database tests completed! Results saved to: ${filePath}`);
  
  // Close database connection
  await sequelize.close();
}

// Run the tests
runAllTests().catch(err => {
  console.error('Error running tests:', err);
  process.exit(1);
});

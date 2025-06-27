const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

// Configuration for the performance tests
const config = {
  url: 'http://localhost:3000',
  connections: 10,      // Number of concurrent connections
  duration: 10,         // Duration of test in seconds
  requests: [
    {
      method: 'GET',
      path: '/users'
    },
    {
      method: 'GET',
      path: '/users/1'
    },
    {
      method: 'POST',
      path: '/users',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com'
      })
    },
    {
      method: 'PUT',
      path: '/users/1',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Updated User',
        email: 'updated@example.com'
      })
    },
    {
      method: 'DELETE',
      path: '/users/2'
    },
    {
      method: 'POST',
      path: '/users/2/restore',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    {
      method: 'GET',
      path: '/health'
    }
  ]
};

// Function to run a single test
async function runTest(request) {
  const testConfig = {
    url: config.url,
    connections: config.connections,
    duration: config.duration,
    title: `${request.method} ${request.path}`,
    requests: [request]
  };

  console.log(`Starting test: ${testConfig.title}`);
  
  return new Promise((resolve) => {
    autocannon(testConfig, (err, result) => {
      if (err) {
        console.error('Error running test:', err);
        resolve(null);
        return;
      }
      
      // Save detailed results to a file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${request.method}_${request.path.replace(/\//g, '_')}_${timestamp}.json`;
      const filePath = path.join(__dirname, 'results', fileName);
      
      // Ensure results directory exists
      if (!fs.existsSync(path.join(__dirname, 'results'))) {
        fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
      
      // Print summary
      console.log(`\nTest completed: ${testConfig.title}`);
      console.log(`  Requests: ${result.requests.total}`);
      console.log(`  Throughput: ${result.requests.average} req/sec`);
      console.log(`  Latency (avg): ${result.latency.average} ms`);
      console.log(`  Latency (p99): ${result.latency.p99} ms`);
      console.log(`  Results saved to: ${filePath}\n`);
      
      resolve(result);
    });
  });
}

// Run all tests sequentially
async function runAllTests() {
  console.log('Starting performance tests...\n');
  
  const results = [];
  
  for (const request of config.requests) {
    const result = await runTest(request);
    if (result) {
      results.push({
        title: `${request.method} ${request.path}`,
        requests: result.requests,
        latency: result.latency
      });
    }
  }
  
  // Generate summary report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const summaryPath = path.join(__dirname, 'results', `summary_${timestamp}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  
  console.log('\nAll tests completed!');
  console.log(`Summary report saved to: ${summaryPath}`);
}

runAllTests().catch(console.error);

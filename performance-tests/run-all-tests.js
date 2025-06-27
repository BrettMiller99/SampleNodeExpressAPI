const { spawn } = require('child_process');
const path = require('path');


// Function to run a script and return a promise
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning ${path.basename(scriptPath)}...\n`);
    
    const childProcess = spawn('node', [scriptPath], { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });
    
    childProcess.on('error', (err) => {
      reject(err);
    });
  });
}

// Main function to run all tests
async function runAllTests() {
  try {
    // First make sure the server is running
    console.log('\n=== PERFORMANCE TESTING SUITE ===');
    console.log('\nNOTE: Make sure the server is running on http://localhost:3000 before continuing.');
    console.log('You can start the server in another terminal with: node app.js\n');
    

    
    // Run API endpoint tests
    await runScript(path.join(__dirname, 'run-tests.js'));
    
    // Run database performance tests
    await runScript(path.join(__dirname, 'db-monitor.js'));
    
    // Visualize the results
    await runScript(path.join(__dirname, 'visualize-results.js'));
    
    console.log('\n=== ALL PERFORMANCE TESTS COMPLETED ===\n');
    
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

runAllTests();

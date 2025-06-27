const fs = require('fs');
const path = require('path');

// Function to read the latest result files
function getLatestResults() {
  const resultsDir = path.join(__dirname, 'results');
  
  if (!fs.existsSync(resultsDir)) {
    console.error('No results directory found. Run tests first.');
    process.exit(1);
  }
  
  // Get all files in the results directory
  const files = fs.readdirSync(resultsDir);
  
  // Find the latest summary file
  const summaryFiles = files.filter(f => f.startsWith('summary_'));
  if (summaryFiles.length === 0) {
    console.error('No summary files found. Run API tests first.');
    return null;
  }
  
  summaryFiles.sort();
  const latestSummary = summaryFiles[summaryFiles.length - 1];
  const summaryPath = path.join(resultsDir, latestSummary);
  const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  
  // Find the latest DB performance file
  const dbFiles = files.filter(f => f.startsWith('db_performance_'));
  if (dbFiles.length === 0) {
    console.error('No DB performance files found. Run DB tests first.');
    return { summaryData, dbData: null };
  }
  
  dbFiles.sort();
  const latestDb = dbFiles[dbFiles.length - 1];
  const dbPath = path.join(resultsDir, latestDb);
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  return { summaryData, dbData };
}

// Function to generate a simple ASCII chart
function generateAsciiChart(data, title, valueKey) {
  // Handle empty data
  if (!data || data.length === 0) {
    return `\n${title}\n${'='.repeat(title.length)}\n\nNo data available.\n`;
  }

  // Get the value safely with path navigation
  function getNestedValue(obj, path) {
    if (!obj) return null;
    
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) return null;
      current = current[part];
    }
    
    return current;
  }
  
  // Get labels and values safely
  const labels = data.map(item => item.title || item.query || 'Unknown');
  const values = data.map(item => getNestedValue(item, valueKey) || 0);
  
  const maxLabelLength = Math.max(...labels.map(label => label.length));
  const maxValue = Math.max(...values);
  const chartWidth = 50;
  
  let chart = `\n${title}\n${'='.repeat(title.length)}\n\n`;
  
  data.forEach((item, index) => {
    const label = labels[index];
    const value = values[index];
    const barLength = maxValue > 0 ? Math.round((value / maxValue) * chartWidth) : 0;
    const bar = '█'.repeat(barLength);
    
    chart += `${label.padEnd(maxLabelLength)} | ${value.toFixed(2).padStart(7)} | ${bar}\n`;
  });
  
  return chart;
}

// Main function to visualize results
function visualizeResults() {
  const results = getLatestResults();
  if (!results) return;
  
  const { summaryData, dbData } = results;
  
  console.log('\n=== PERFORMANCE TEST RESULTS ===\n');
  
  // API Endpoint Performance
  if (summaryData) {
    console.log(generateAsciiChart(
      summaryData, 
      'API ENDPOINT PERFORMANCE (requests/sec)',
      'requests.average'
    ));
    
    console.log(generateAsciiChart(
      summaryData, 
      'API ENDPOINT LATENCY (ms)',
      'latency.average'
    ));
  }
  
  // Database Performance
  if (dbData) {
    console.log(generateAsciiChart(
      dbData, 
      'DATABASE QUERY PERFORMANCE (ms)',
      'averageMs'
    ));
  }
  
  console.log('\nDetailed results available in the results directory.');
}

visualizeResults();

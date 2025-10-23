const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run export
function runExport() {
  try {
    console.log('Building with export configuration...');
    
    // Set environment variable for export build
    if (process.platform === 'win32') {
      execSync('set "EXPORT_BUILD=true" && next build', { stdio: 'inherit', shell: true });
    } else {
      execSync('EXPORT_BUILD=true next build', { stdio: 'inherit' });
    }
    
    console.log('Export completed successfully!');
  } catch (error) {
    console.error('Export failed:', error.message);
    process.exit(1);
  }
}

runExport();
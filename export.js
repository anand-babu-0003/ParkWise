const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run build
function runBuild() {
  try {
    console.log('Building application...');
    
    // Run next build
    execSync('next build', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
    console.log('To deploy for mobile:');
    console.log('1. Deploy to a hosting service like Vercel');
    console.log('2. Update capacitor.config.ts with the deployed URL');
    console.log('3. Run: npm run capacitor:build');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

runBuild();
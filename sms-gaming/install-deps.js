const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing dependencies...');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('node_modules not found, creating directory...');
  fs.mkdirSync(path.join(__dirname, 'node_modules'), { recursive: true });
}

try {
  // Install all dependencies
  console.log('Running npm install...');
  execSync('npm install', { stdio: 'inherit' });

  // Ensure superb is installed
  console.log('Installing superb module...');
  execSync('npm install superb@4.0.0 --save', { stdio: 'inherit' });

  // Verify superb installation
  try {
    require('superb');
    console.log('superb module installed successfully!');
  } catch (error) {
    console.error('Error verifying superb module:', error);
    process.exit(1);
  }

  console.log('All dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
} 
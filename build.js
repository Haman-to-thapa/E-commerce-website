const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting build process...');

try {
  // Install root dependencies
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Install and build frontend
  console.log('Building frontend...');
  execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });

  // Check if frontend build directory exists
  const frontendBuildDir = path.join(__dirname, 'frontend', 'build');
  if (!fs.existsSync(frontendBuildDir)) {
    console.error('Frontend build directory does not exist!');
    process.exit(1);
  }

  console.log('Frontend build completed successfully!');
  
  // Install backend dependencies
  console.log('Installing backend dependencies...');
  execSync('cd Backend && npm install', { stdio: 'inherit' });
  
  console.log('Build process completed successfully!');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}

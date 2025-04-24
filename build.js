const { execSync } = require('child_process');
const fs = require('fs');

// Build the frontend
console.log('Building frontend...');
try {
  execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
  console.log('Frontend build completed successfully.');
} catch (error) {
  console.error('Frontend build failed:', error);
  process.exit(1);
}

// Create a simple shell script to copy the dist folder
console.log('Creating copy script...');
const copyScript = `
#!/bin/bash
mkdir -p dist
cp -r frontend/dist/* dist/
`;

fs.writeFileSync('copy-dist.sh', copyScript);
fs.chmodSync('copy-dist.sh', 0o755);

// Execute the copy script
console.log('Copying dist folder to root...');
try {
  execSync('./copy-dist.sh', { stdio: 'inherit' });
  console.log('Dist folder copied to root successfully.');
} catch (error) {
  console.error('Failed to copy dist folder:', error);
  process.exit(1);
}

console.log('Build process completed successfully.');

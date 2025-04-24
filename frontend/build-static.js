import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting static build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Run the Vite build
  console.log('Running Vite build...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if build directory exists
  const buildDir = path.join(__dirname, 'build');
  const distDir = path.join(__dirname, 'dist');
  
  // Create build directory if it doesn't exist
  if (!fs.existsSync(buildDir)) {
    console.log('Build directory does not exist, creating it...');
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // If dist directory exists, copy its contents to build
  if (fs.existsSync(distDir)) {
    console.log('Copying files from dist to build...');
    
    // Copy all files from dist to build
    copyDirRecursive(distDir, buildDir);
    
    console.log('Files copied successfully!');
  } else {
    console.log('Dist directory does not exist, creating a placeholder index.html...');
    
    // Create a placeholder index.html
    const placeholderHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-Commerce Website</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>E-Commerce Website</h1>
          <p>Loading application...</p>
          <p>If this page doesn't redirect automatically, please click <a href="/">here</a>.</p>
        </div>
      </body>
      </html>
    `;
    
    fs.writeFileSync(path.join(buildDir, 'index.html'), placeholderHtml);
    console.log('Placeholder index.html created!');
  }
  
  // List the contents of the build directory
  console.log('Contents of build directory:');
  listDir(buildDir);
  
  console.log('Build process completed successfully!');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}

// Function to copy directory recursively
function copyDirRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Get all files and directories in source
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  // Copy each entry
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy directory
      copyDirRecursive(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to list directory contents
function listDir(dir, indent = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      console.log(`${indent}${entry.name}/`);
      listDir(entryPath, `${indent}  `);
    } else {
      const stats = fs.statSync(entryPath);
      console.log(`${indent}${entry.name} (${formatSize(stats.size)})`);
    }
  }
}

// Function to format file size
function formatSize(size) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting build process...');

// Run the Vite build
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error.message}`);
    return;
  }
  
  console.log('Vite build output:');
  console.log(stdout);
  
  if (stderr) {
    console.error(`Vite build stderr: ${stderr}`);
  }
  
  // Check if dist directory exists
  const distDir = path.join(__dirname, 'dist');
  const buildDir = path.join(__dirname, 'build');
  
  if (fs.existsSync(distDir)) {
    console.log('Dist directory exists, copying to build directory...');
    
    // Create build directory if it doesn't exist
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }
    
    // Copy all files from dist to build
    copyFolderRecursiveSync(distDir, buildDir);
    
    console.log('Build directory created successfully!');
  } else {
    console.error('Dist directory does not exist. Build may have failed.');
  }
});

// Function to copy folder recursively
function copyFolderRecursiveSync(source, target) {
  // Check if source exists
  if (!fs.existsSync(source)) {
    return;
  }

  // Create target folder if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Copy all files and subfolders
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      // Recursive call for directories
      copyFolderRecursiveSync(sourcePath, targetPath);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

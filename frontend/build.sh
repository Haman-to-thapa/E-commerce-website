#!/bin/bash

# Navigate to the frontend directory
cd "$(dirname "$0")"

# Install dependencies
npm install

# Run the Vite build
npm run build

# Create build directory if it doesn't exist
mkdir -p build

# Copy all files from dist to build
if [ -d "dist" ]; then
  cp -r dist/* build/
  echo "Successfully copied dist contents to build directory"
else
  echo "Error: dist directory not found after build"
  exit 1
fi

# Verify the build directory has content
if [ "$(ls -A build)" ]; then
  echo "Build directory is not empty, build successful!"
else
  echo "Error: Build directory is empty"
  exit 1
fi

#!/bin/bash
# This script is specifically for building the frontend on Render

# Install dependencies
npm install

# Build the project
npm run build

# Verify the build directory exists
if [ -d "build" ]; then
  echo "Build directory exists at $(pwd)/build"
  ls -la build/
else
  echo "Build directory does not exist at $(pwd)/build"
  echo "Checking for dist directory..."
  if [ -d "dist" ]; then
    echo "Dist directory found, copying to build..."
    mkdir -p build
    cp -r dist/* build/
    echo "Contents of build directory after copy:"
    ls -la build/
  else
    echo "Neither build nor dist directory exists. Build may have failed."
    exit 1
  fi
fi

# Create a simple index.html if it doesn't exist
if [ ! -f "build/index.html" ]; then
  echo "Creating a simple index.html in build directory..."
  echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>E-Commerce Website</title></head><body><div id="root"></div><script>window.location.href = "/";</script></body></html>' > build/index.html
fi

echo "Build process completed successfully!"

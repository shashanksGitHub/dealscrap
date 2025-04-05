#!/bin/bash

echo "Starting deployment process..."

# Remove existing dist directory to ensure a clean build
echo "Cleaning previous build artifacts..."
rm -rf dist

# Copy assets to public directory using ES modules
echo "Copying assets to public directory..."
node copy-assets.js

# Run the build command from package.json
echo "Building the application..."
npm run build

# Make sure the attached_assets directory is available in dist
echo "Ensuring assets are available in production build..."
mkdir -p dist/attached_assets
cp -r attached_assets/* dist/attached_assets/

echo "Deployment preparation completed!"
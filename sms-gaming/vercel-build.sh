#!/bin/bash
echo "Cleaning previous install..."
rm -rf node_modules package-lock.json

echo "Installing dependencies..."
npm install

echo "Installing production dependencies..."
npm install --production

echo "Verifying html-entities installation..."
ls -la node_modules/html-entities

echo "Build completed successfully!" 
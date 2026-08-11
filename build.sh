#!/usr/bin/env bash
# exit on error
set -o errexit

# 1. Build React Frontend
echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Install Python backend dependencies
echo "Installing Python Dependencies..."
pip install -r requirements.txt
echo "Build Complete!"

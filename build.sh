#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python backend dependencies
echo "Installing Python Dependencies..."
pip install -r requirements.txt
echo "Build Complete!"

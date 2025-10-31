#!/bin/bash

# Jekyll Development Server Startup Script
# This script starts the Jekyll server with auto-reload and live-reload enabled

echo "Starting Jekyll development server..."
echo "The server will watch for file changes and automatically rebuild."
echo "Your site will be available at: http://127.0.0.1:4000"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

# Start Jekyll with watch and livereload enabled
bundle exec jekyll serve \
  --host 127.0.0.1 \
  --port 4000 \
  --livereload \
  --livereload-port 35729 \
  --incremental \
  --watch


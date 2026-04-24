#!/bin/sh
echo "Running migrations..."
npm run migration:run
echo "Starting application..."
npm run start:prod
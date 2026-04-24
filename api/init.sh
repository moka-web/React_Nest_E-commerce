#!/bin/sh
echo "========================================"
echo "Running migrations..."
npm run migration:run || { echo "Migration FAILED"; exit 1; }
echo "Migrations completed successfully"
echo "Starting application..."
echo "========================================"
exec npm run start:prod
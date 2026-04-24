#!/bin/sh
echo "========================================"
echo "Running migrations..."
npm run migration:run || { echo "Migration FAILED"; exit 1; }
echo "Migrations completed successfully"
echo "========================================"
echo "Running seed..."
npm run seed:run || { echo "Seed FAILED"; exit 1; }
echo "Seed completed successfully"
echo "========================================"
echo "Starting application..."
exec npm run start:prod
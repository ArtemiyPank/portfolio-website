#!/bin/sh
set -e

echo "🚀 Starting Portfolio application..."

# Ensure data directory exists
if [ ! -d "/app/data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p /app/data
fi

# Ensure uploads directory exists
if [ ! -d "/app/public/uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p /app/public/uploads
fi

# Initialize database if it doesn't exist
if [ ! -f "/app/data/portfolio.db" ]; then
    echo "🗄️  Database not found. Initializing..."
    node scripts/init-db.js
    echo "✅ Database initialized successfully!"
else
    echo "✅ Database already exists at /app/data/portfolio.db"
fi

# Execute the main command
echo "🌐 Starting Next.js server..."
exec "$@"

#!/bin/bash

echo "🔍 Docker Debug Information"
echo "=========================="

echo ""
echo "📦 Container Status:"
sudo docker-compose ps

echo ""
echo "📋 Container Logs (last 20 lines):"
sudo docker-compose logs --tail=20 portfolio

echo ""
echo "🗂️  Directory Structure in Container:"
sudo docker-compose exec portfolio ls -la /app/

echo ""
echo "📁 Public Directory:"
sudo docker-compose exec portfolio ls -la /app/public/

echo ""
echo "📁 Uploads Directory:"
sudo docker-compose exec portfolio ls -la /app/public/uploads/ 2>/dev/null || echo "Uploads directory not accessible"

echo ""
echo "🔐 Permissions:"
sudo docker-compose exec portfolio ls -ld /app/public/uploads/ 2>/dev/null || echo "Cannot check uploads permissions"

echo ""
echo "💾 Data Directory:"
sudo docker-compose exec portfolio ls -la /app/data/ 2>/dev/null || echo "Data directory not accessible"

echo ""
echo "🌐 Network Test:"
curl -s http://localhost:3000/api/projects > /dev/null && echo "✅ API accessible" || echo "❌ API not accessible"

#!/bin/bash

# Live News Explorer Development Startup Script

echo "🚀 Starting Live News Explorer Development Environment"
echo "=================================================="

# Check if Redis is running
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running. Please start Redis server first:"
    echo "   brew services start redis"
    echo "   or"
    echo "   redis-server"
    exit 1
fi

echo "✅ Redis is running"

# Check if Python service dependencies are installed
if [ ! -d "python-ranking-service/venv" ]; then
    echo "📦 Setting up Python virtual environment..."
    cd python-ranking-service
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    echo "✅ Python dependencies installed"
else
    echo "✅ Python dependencies already installed"
fi

# Start Python ranking service in background
echo "🐍 Starting Python ranking service..."
cd python-ranking-service
source venv/bin/activate
python main.py &
PYTHON_PID=$!
cd ..

# Wait a moment for Python service to start
sleep 3

# Start Next.js development server
echo "⚛️  Starting Next.js development server..."
npm run dev &
NEXTJS_PID=$!

echo ""
echo "🎉 Development environment started!"
echo "=================================================="
echo "📰 Next.js app: http://localhost:3000"
echo "🐍 Python API: http://localhost:8000"
echo "📊 API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $PYTHON_PID 2>/dev/null
    kill $NEXTJS_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait

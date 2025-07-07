#!/bin/bash

echo "🛑 Stopping Bike Taxi Service..."
echo "=================================="

# Function to kill process by PID file
kill_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping $service_name (PID: $pid)..."
            kill $pid
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                echo "Force killing $service_name..."
                kill -9 $pid
            fi
        else
            echo "$service_name is not running"
        fi
        rm -f "$pid_file"
    else
        echo "$service_name PID file not found"
    fi
}

# Stop Spring Boot services
echo "🔄 Stopping Spring Boot services..."
kill_service "Booking Service" "booking-service.pid"
kill_service "Driver Matching Service" "matching-service.pid"

# Stop frontend services
echo "🌐 Stopping frontend services..."
kill_service "Rider UI" "rider-ui.pid"
kill_service "Driver Simulator" "driver-simulator.pid"

# Stop Docker containers
echo "🐳 Stopping Docker containers..."
docker-compose -f docker-compose.yml down
docker-compose -f kafka/docker-compose-kafka.yml down

# Clean up log files
echo "🧹 Cleaning up log files..."
rm -f *.log

echo ""
echo "✅ All services stopped successfully!"
echo "=================================="
echo "📊 Services stopped:"
echo "  • PostgreSQL"
echo "  • Kafka & Zookeeper"
echo "  • Booking Service"
echo "  • Driver Matching Service"
echo "  • Rider UI"
echo "  • Driver Simulator"
echo ""
echo "🚀 To start again, run: ./start.sh" 
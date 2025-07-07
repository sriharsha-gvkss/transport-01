#!/bin/bash

echo "🚲 Starting Bike Taxi Service..."
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Function to check if a port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use. Please free up the port and try again."
        exit 1
    fi
}

# Check if required ports are available
echo "🔍 Checking port availability..."
check_port 5432  # PostgreSQL
check_port 9092  # Kafka
check_port 8080  # Booking Service
check_port 5500  # Rider UI
check_port 5600  # Driver Simulator

echo "✅ All ports are available"

# Build Spring Boot applications
echo "🔨 Building Spring Boot applications..."

# Build Booking Service
echo "Building Booking Service..."
cd booking-service
if ! ./mvnw clean package -DskipTests; then
    echo "❌ Failed to build Booking Service"
    exit 1
fi
cd ..

echo "✅ All applications built successfully"

# Start infrastructure services
echo "🐳 Starting infrastructure services..."
docker-compose -f docker-compose.yml up -d
docker-compose -f kafka/docker-compose-kafka.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Start Spring Boot services
echo "🚀 Starting Spring Boot services..."

# Start Booking Service
echo "Starting Booking Service on port 8080..."
cd booking-service
nohup ./mvnw spring-boot:run > ../booking-service.log 2>&1 &
BOOKING_PID=$!
cd ..

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Start frontend services
echo "🌐 Starting frontend services..."

# Start Rider UI
echo "Starting Rider UI on port 5500..."
cd map-client
nohup python3 -m http.server 5500 > ../rider-ui.log 2>&1 &
RIDER_PID=$!
cd ..

# Start Driver Simulator
echo "Starting Driver Simulator on port 5600..."
cd driver-simulator
nohup python3 -m http.server 5600 > ../driver-simulator.log 2>&1 &
DRIVER_PID=$!
cd ..

# Save PIDs for cleanup
echo $BOOKING_PID > booking-service.pid
echo $RIDER_PID > rider-ui.pid
echo $DRIVER_PID > driver-simulator.pid

echo ""
echo "🎉 Bike Taxi Service is now running!"
echo "=================================="
echo "📊 Services Status:"
echo "  • PostgreSQL:     http://localhost:5432"
echo "  • Kafka:          localhost:9092"
echo "  • Booking Service: http://localhost:8080 (includes matching)"
echo "  • Rider UI:       http://localhost:5500"
echo "  • Driver Simulator: http://localhost:5600"
echo ""
echo "📋 Next Steps:"
echo "  1. Open http://localhost:5500 in your browser (Rider UI)"
echo "  2. Open http://localhost:5600 in another tab (Driver Simulator)"
echo "  3. Click 'Start Simulator' in the Driver Simulator"
echo "  4. Set pickup and destination points on the map"
echo "  5. Click 'Book Ride' to test the system"
echo ""
echo "🛑 To stop all services, run: ./stop.sh"
echo "📝 Logs are saved in: *.log files"
echo ""
echo "Happy testing! 🚲✨" 
# 🚗 Driver Simulator - React

A modern, React-based driver simulator for the Bike Ride App. This application allows you to simulate driver behavior, location updates, and real-time communication with the backend server.

## ✨ Features

- **Real-time WebSocket Communication** - Connect to the backend server for live updates
- **Location Simulation** - Simulate driver movement with customizable speed and intervals
- **Interactive Map** - Visualize driver location and movement history using Leaflet maps
- **Modern UI** - Beautiful, responsive interface built with Material-UI
- **Activity Logging** - Real-time logs of all activities and events
- **Connection Management** - Automatic reconnection and connection status monitoring
- **Booking Notifications** - Receive and respond to booking requests

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `localhost:8080`

### Installation

1. Navigate to the driver simulator directory:
   ```bash
   cd driver-simulator-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 📱 Usage

### Connection Setup

1. **Enter Driver ID**: Set a unique identifier for your driver (e.g., `driver001`)
2. **Connect to Server**: Click the "Connect" button to establish WebSocket connection
3. **Monitor Status**: The connection status indicator shows if you're connected

### Location Simulation

1. **Set Speed**: Configure the simulation speed in km/h (default: 30 km/h)
2. **Set Update Interval**: Choose how frequently location updates are sent (default: 5000ms)
3. **Start Simulation**: Click "Start Simulation" to begin location updates
4. **Monitor Movement**: Watch the driver move on the map in real-time
5. **Stop Simulation**: Click "Stop Simulation" to halt location updates

### Map Features

- **Current Location**: Blue marker shows the driver's current position
- **Movement Path**: Blue line shows the driver's movement history
- **Interactive Controls**: Zoom, pan, and click on markers for details

### Activity Logs

- **Real-time Updates**: All activities are logged with timestamps
- **Message Types**: Different colors for info, success, and error messages
- **Clear Logs**: Use the "Clear Logs" button to reset the log display

## 🔧 Configuration

### Backend Connection

The simulator connects to the backend server at `ws://localhost:8080/ws/driver/{driverId}`. Make sure your backend server is running and supports WebSocket connections.

### Environment Variables

You can customize the backend URL by setting environment variables:

```bash
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
```

## 📁 Project Structure

```
driver-simulator-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── MapComponent.js
│   ├── services/
│   │   ├── LocationService.js
│   │   └── WebSocketService.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Material-UI** - Beautiful, responsive UI components
- **Leaflet** - Interactive maps
- **WebSocket** - Real-time communication
- **CSS3** - Modern styling with animations

## 🔌 API Integration

### WebSocket Messages

The simulator sends and receives the following message types:

#### Outgoing Messages
- `DRIVER_REGISTER` - Register driver with the server
- `DRIVER_LOCATION` - Send current location updates
- `DRIVER_STATUS` - Update driver status (available/busy/offline)
- `BOOKING_RESPONSE` - Accept or reject booking requests
- `TRIP_COMPLETED` - Mark trip as completed

#### Incoming Messages
- `LOCATION_UPDATE` - Receive location updates from server
- `BOOKING_REQUEST` - Receive new booking requests
- `DRIVER_ASSIGNMENT` - Driver assigned to a booking
- `SYSTEM_MESSAGE` - General system messages
- `ERROR` - Error messages from server

## 🎨 Customization

### Styling

The application uses Material-UI theming. You can customize colors, fonts, and other styles by modifying the CSS files:

- `src/App.css` - Main application styles
- `src/index.css` - Global styles

### Map Configuration

Modify the `MapComponent.js` to customize map settings:

- Map provider (OpenStreetMap, Google Maps, etc.)
- Default zoom level
- Marker styles
- Path colors and styles

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Ensure the backend server is running on port 8080
   - Check if WebSocket endpoint is available
   - Verify firewall settings

2. **Map Not Loading**
   - Check internet connection (map tiles require internet)
   - Ensure Leaflet CSS is loaded
   - Check browser console for errors

3. **Location Simulation Not Working**
   - Verify WebSocket connection is established
   - Check browser console for JavaScript errors
   - Ensure location service is properly initialized

### Debug Mode

Enable debug logging by opening browser console and setting:

```javascript
localStorage.setItem('debug', 'true');
```

## 📄 License

This project is part of the Bike Ride App and follows the same licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please refer to the main Bike Ride App documentation or create an issue in the repository. 
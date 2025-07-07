import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  LocationOn,
  DirectionsCar,
  Speed,
  Timer,
  Wifi,
  WifiOff,
  PlayArrow,
  Stop,
  Refresh
} from '@mui/icons-material';
import MapComponent from './components/MapComponent';
import LocationService from './services/LocationService';
import WebSocketService from './services/WebSocketService';
import './App.css';

function App() {
  const [driverId, setDriverId] = useState('driver001');
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [speed, setSpeed] = useState(30);
  const [updateInterval, setUpdateInterval] = useState(5000);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);

  const locationService = new LocationService();
  const webSocketService = new WebSocketService();

  useEffect(() => {
    // Initialize location service
    locationService.initialize();
    
    // Cleanup on unmount
    return () => {
      locationService.cleanup();
      webSocketService.disconnect();
    };
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const connectToServer = async () => {
    try {
      setError(null);
      addLog('Connecting to server...', 'info');
      
      await webSocketService.connect(driverId);
      setIsConnected(true);
      addLog('Connected to server successfully!', 'success');
      
      // Start listening for location updates
      webSocketService.onLocationUpdate((location) => {
        setCurrentLocation(location);
        setLocationHistory(prev => [...prev, location]);
        addLog(`Location updated: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, 'info');
      });
      
    } catch (err) {
      setError('Failed to connect to server: ' + err.message);
      addLog('Connection failed: ' + err.message, 'error');
    }
  };

  const disconnectFromServer = () => {
    webSocketService.disconnect();
    setIsConnected(false);
    setIsSimulating(false);
    addLog('Disconnected from server', 'info');
  };

  const startSimulation = () => {
    if (!isConnected) {
      setError('Must be connected to server first');
      return;
    }

    setIsSimulating(true);
    addLog('Starting location simulation...', 'info');
    
    const interval = setInterval(() => {
      if (!isSimulating) {
        clearInterval(interval);
        return;
      }

      const newLocation = locationService.simulateMovement(currentLocation, speed);
      setCurrentLocation(newLocation);
      
      // Send location to server
      webSocketService.sendLocation(newLocation);
      
      addLog(`Simulated movement: ${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)}`, 'info');
    }, updateInterval);

    // Cleanup interval on component unmount or when simulation stops
    return () => clearInterval(interval);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    addLog('Stopped location simulation', 'info');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const resetLocation = () => {
    const defaultLocation = { lat: 12.9716, lng: 77.5946 };
    setCurrentLocation(defaultLocation);
    setLocationHistory([]);
    addLog('Location reset to default', 'info');
  };

  return (
    <Container maxWidth="lg" className="driver-simulator">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        🚗 Driver Simulator
      </Typography>
      
      <Grid container spacing={3}>
        {/* Connection Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Wifi /> Connection Settings
              </Typography>
              
              <TextField
                fullWidth
                label="Driver ID"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                margin="normal"
                variant="outlined"
              />
              
              <Box sx={{ mt: 2, mb: 2 }}>
                <Chip
                  icon={isConnected ? <Wifi /> : <WifiOff />}
                  label={isConnected ? 'Connected' : 'Disconnected'}
                  color={isConnected ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                color={isConnected ? 'error' : 'primary'}
                onClick={isConnected ? disconnectFromServer : connectToServer}
                disabled={isSimulating}
                sx={{ mb: 1 }}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Simulation Controls */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <DirectionsCar /> Simulation Controls
              </Typography>
              
              <TextField
                fullWidth
                label="Speed (km/h)"
                type="number"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <Speed sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              
              <TextField
                fullWidth
                label="Update Interval (ms)"
                type="number"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Number(e.target.value))}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <Timer sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                color={isSimulating ? 'error' : 'success'}
                onClick={isSimulating ? stopSimulation : startSimulation}
                disabled={!isConnected}
                startIcon={isSimulating ? <Stop /> : <PlayArrow />}
                sx={{ mb: 1 }}
              >
                {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                onClick={resetLocation}
                startIcon={<Refresh />}
              >
                Reset Location
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Location */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <LocationOn /> Current Location
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Latitude: {currentLocation.lat.toFixed(6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Longitude: {currentLocation.lng.toFixed(6)}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                Speed: {speed} km/h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update Interval: {updateInterval}ms
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                Location History: {locationHistory.length} points
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Map */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📍 Location Map
              </Typography>
              <MapComponent 
                currentLocation={currentLocation}
                locationHistory={locationHistory}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Logs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  📋 Activity Logs
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearLogs}
                >
                  Clear Logs
                </Button>
              </Box>
              
              <Paper 
                sx={{ 
                  height: 200, 
                  overflow: 'auto', 
                  p: 2, 
                  backgroundColor: '#f8f9fa',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
              >
                {logs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No logs yet...
                  </Typography>
                ) : (
                  logs.map((log, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography 
                        variant="body2" 
                        color={log.type === 'error' ? 'error' : log.type === 'success' ? 'success.main' : 'text.secondary'}
                      >
                        [{log.timestamp}] {log.message}
                      </Typography>
                    </Box>
                  ))
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App; 
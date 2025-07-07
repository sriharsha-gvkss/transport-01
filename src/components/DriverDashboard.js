import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Header from './Header';
import MapComponent from '../../driver-simulator-react/src/components/MapComponent';
import LocationService from '../../driver-simulator-react/src/services/LocationService';

const API_BASE = 'http://localhost:8080/api';

const DriverDashboard = () => {
  const { auth, logout } = useAuth();
  const [rideRequests, setRideRequests] = useState([]);
  const [driverStatus, setDriverStatus] = useState('AVAILABLE');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ lat: 17.385, lng: 78.4867 });
  const [locationHistory, setLocationHistory] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [completedRides, setCompletedRides] = useState(0);

  useEffect(() => {
    fetchRideRequests();
    fetchDriverStatus();
    fetchEarnings();
    // Get current location
    const locationService = new LocationService();
    locationService.getCurrentLocation().then(loc => {
      setCurrentLocation(loc);
      setLocationHistory([loc]);
    });
    // Watch location
    locationService.watchLocation(loc => {
      setCurrentLocation(loc);
      setLocationHistory(prev => [...prev.slice(-19), loc]);
    });
    return () => locationService.cleanup();
  }, []);

  const fetchRideRequests = async () => {
    try {
      const response = await fetch(`${API_BASE}/bookings/available`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRideRequests(data);
      } else {
        setError('Failed to fetch ride requests');
      }
    } catch (err) {
      setError('Error fetching ride requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/drivers/${auth.username}/status`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDriverStatus(data.status);
      }
    } catch (err) {
      console.error('Error fetching driver status:', err);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await fetch(`${API_BASE}/bookings/driver/${auth.username}`);
      if (response.ok) {
        const bookings = await response.json();
        // Only count completed rides for today
        const today = new Date().toISOString().slice(0, 10);
        let total = 0;
        let completed = 0;
        bookings.forEach(b => {
          if (b.status === 'COMPLETED' && b.createdAt && b.createdAt.slice(0, 10) === today) {
            total += b.price || 0;
            completed += 1;
          }
        });
        setEarnings(total);
        setCompletedRides(completed);
      }
    } catch (err) {
      // fallback: do nothing
    }
  };

  const updateDriverStatus = async (newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/drivers/${auth.username}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setDriverStatus(newStatus);
      }
    } catch (err) {
      setError('Error updating status: ' + err.message);
    }
  };

  const acceptRideRequest = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ driverId: auth.username })
      });
      if (response.ok) {
        fetchRideRequests(); // Refresh the list
        setDriverStatus('BUSY');
      }
    } catch (err) {
      setError('Error accepting ride: ' + err.message);
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: 'white', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Hi, {auth.username}</div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>Status: <span style={{ color: driverStatus === 'AVAILABLE' ? '#b2ff59' : '#ffd600', fontWeight: 600 }}>{driverStatus}</span></div>
        </div>
        <div>
          <button onClick={logout} style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Earnings/Performance Card */}
      <div style={{ maxWidth: 600, margin: '24px auto 0', background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, color: '#888' }}>Today's Earnings</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1976d2' }}>₹{earnings.toFixed(1)}</div>
        </div>
        <div style={{ background: '#e8f5e9', borderRadius: 12, padding: '12px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#388e3c', fontWeight: 600 }}>Completed Rides</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#388e3c' }}>{completedRides}</div>
        </div>
      </div>

      {/* Map Section */}
      <div style={{ maxWidth: 600, margin: '24px auto', background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Your Current Location</div>
        <MapComponent currentLocation={currentLocation} locationHistory={locationHistory} />
      </div>

      {/* Ride Notification Box */}
      <div style={{ maxWidth: 600, margin: '24px auto', background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Ride Notifications</div>
        {loading && <p>Loading ride requests...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <div>
            {rideRequests.length === 0 ? (
              <p>No ride requests available.</p>
            ) : (
              <div>
                {rideRequests.map((request, index) => (
                  <div key={index} style={{ background: '#f5f5f5', padding: 16, marginBottom: 12, borderRadius: 8, border: '1px solid #ddd' }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>New Ride Request</div>
                    <div><strong>Pickup:</strong> {request.pickupLocation}</div>
                    <div><strong>Destination:</strong> {request.destination}</div>
                    <div><strong>Distance:</strong> {request.distance} km</div>
                    <div><strong>Price:</strong> ₹{request.price}</div>
                    <button onClick={() => acceptRideRequest(request.id)} disabled={driverStatus !== 'AVAILABLE'} style={{ background: driverStatus === 'AVAILABLE' ? '#1976d2' : '#ccc', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 6, marginTop: 12, fontWeight: 600, cursor: driverStatus === 'AVAILABLE' ? 'pointer' : 'not-allowed' }}>Accept Ride</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard; 
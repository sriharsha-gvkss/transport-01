import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Header from './Header';

const API_BASE = 'http://localhost:8080/api';

const UserDashboard = () => {
  const { auth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`${API_BASE}/bookings/rider/${auth.username}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ padding: 24 }}>
        <h2>User Dashboard</h2>
        
        <div style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24 
        }}>
          <h3>User Information</h3>
          <p><strong>Username:</strong> {auth.username}</p>
          <p><strong>Role:</strong> {auth.role}</p>
          <p><strong>Email:</strong> {auth.email || 'Not provided'}</p>
        </div>

        <div style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24 
        }}>
          <h3>Quick Actions</h3>
          <button 
            onClick={() => window.open('/map-client', '_blank')}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 4,
              marginRight: 12,
              cursor: 'pointer'
            }}
          >
            Book a Ride
          </button>
          <button 
            onClick={fetchUserBookings}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Refresh Bookings
          </button>
        </div>

        <div style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 8 
        }}>
          <h3>Ride History</h3>
          {loading && <p>Loading bookings...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <div>
              {bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                <div>
                  {bookings.map((booking, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        background: 'white', 
                        padding: 12, 
                        marginBottom: 8, 
                        borderRadius: 4,
                        border: '1px solid #ddd'
                      }}
                    >
                      <p><strong>Booking ID:</strong> {booking.id}</p>
                      <p><strong>Status:</strong> {booking.status}</p>
                      <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
                      <p><strong>Destination:</strong> {booking.destination}</p>
                      <p><strong>Price:</strong> ₹{booking.price}</p>
                      <p><strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 
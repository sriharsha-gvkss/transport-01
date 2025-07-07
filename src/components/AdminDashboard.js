import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Header from './Header';

const API_BASE = 'http://localhost:8080/api';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch all data in parallel
      const [usersRes, driversRes, bookingsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE}/admin/drivers`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE}/admin/bookings`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (driversRes.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

    } catch (err) {
      setError('Error fetching admin data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAdminData(); // Refresh data
      }
    } catch (err) {
      setError('Error updating user status: ' + err.message);
    }
  };

  const toggleDriverStatus = async (driverId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await fetch(`${API_BASE}/admin/drivers/${driverId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAdminData(); // Refresh data
      }
    } catch (err) {
      setError('Error updating driver status: ' + err.message);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ padding: 24 }}>
        <h2>Admin Dashboard</h2>
        
        <div style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24 
        }}>
          <h3>Admin Information</h3>
          <p><strong>Username:</strong> {auth.username}</p>
          <p><strong>Role:</strong> {auth.role}</p>
        </div>

        <div style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24 
        }}>
          <h3>System Statistics</h3>
          {loading ? (
            <p>Loading statistics...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ background: 'white', padding: 16, borderRadius: 4, textAlign: 'center' }}>
                <h4>Total Users</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>{stats.totalUsers || 0}</p>
              </div>
              <div style={{ background: 'white', padding: 16, borderRadius: 4, textAlign: 'center' }}>
                <h4>Total Drivers</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>{stats.totalDrivers || 0}</p>
              </div>
              <div style={{ background: 'white', padding: 16, borderRadius: 4, textAlign: 'center' }}>
                <h4>Total Bookings</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>{stats.totalBookings || 0}</p>
              </div>
              <div style={{ background: 'white', padding: 16, borderRadius: 4, textAlign: 'center' }}>
                <h4>Active Bookings</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>{stats.activeBookings || 0}</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24 
        }}>
          <h3>User Management</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <div>
                  {users.map((user, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        background: 'white', 
                        padding: 12, 
                        marginBottom: 8, 
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Status:</strong> 
                          <span style={{ 
                            color: user.status === 'ACTIVE' ? '#4caf50' : '#f44336',
                            fontWeight: 'bold',
                            marginLeft: 8
                          }}>
                            {user.status}
                          </span>
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.status)}
                        style={{
                          background: user.status === 'ACTIVE' ? '#f44336' : '#4caf50',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                      >
                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 8 
        }}>
          <h3>Driver Management</h3>
          {loading ? (
            <p>Loading drivers...</p>
          ) : (
            <div>
              {drivers.length === 0 ? (
                <p>No drivers found.</p>
              ) : (
                <div>
                  {drivers.map((driver, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        background: 'white', 
                        padding: 12, 
                        marginBottom: 8, 
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <p><strong>Username:</strong> {driver.username}</p>
                        <p><strong>Status:</strong> 
                          <span style={{ 
                            color: driver.status === 'AVAILABLE' ? '#4caf50' : 
                                   driver.status === 'BUSY' ? '#ff9800' : '#f44336',
                            fontWeight: 'bold',
                            marginLeft: 8
                          }}>
                            {driver.status}
                          </span>
                        </p>
                        <p><strong>Account Status:</strong> 
                          <span style={{ 
                            color: driver.accountStatus === 'ACTIVE' ? '#4caf50' : '#f44336',
                            fontWeight: 'bold',
                            marginLeft: 8
                          }}>
                            {driver.accountStatus}
                          </span>
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleDriverStatus(driver.id, driver.accountStatus)}
                        style={{
                          background: driver.accountStatus === 'ACTIVE' ? '#f44336' : '#4caf50',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                      >
                        {driver.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div style={{ 
            background: '#ffebee', 
            color: '#c62828', 
            padding: 12, 
            borderRadius: 4, 
            marginTop: 16 
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 
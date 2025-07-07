import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!auth) return null;

  return (
    <div style={{ 
      background: '#1976d2', 
      color: 'white', 
      padding: '12px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div>
        <h3 style={{ margin: 0 }}>Bike Ride App</h3>
        <small>Welcome, {auth.username || 'User'} ({auth.role})</small>
      </div>
      <button 
        onClick={handleLogout}
        style={{
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '8px 16px',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Header; 
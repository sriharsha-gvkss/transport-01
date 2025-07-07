import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const API_URL = 'http://localhost:8080/api/auth/login';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      // data: { token, role }
      login(data.token, data.role);
      if (data.role === 'user') navigate('/user');
      else if (data.role === 'driver') navigate('/driver');
      else if (data.role === 'admin') navigate('/admin');
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, boxShadow: '0 2px 8px #ccc', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Username:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Role:</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }}>
            <option value="user">User</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold', marginBottom: 12 }}>Login</button>
        <div style={{ textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={{ color: '#1976d2' }}>Register here</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 
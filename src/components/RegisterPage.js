import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/auth/register';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Registration failed: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, boxShadow: '0 2px 8px #ccc', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Username:</label>
          <input 
            type="text" 
            name="username"
            value={formData.username} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: 8, marginTop: 4 }} 
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email:</label>
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: 8, marginTop: 4 }} 
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password:</label>
          <input 
            type="password" 
            name="password"
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: 8, marginTop: 4 }} 
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Role:</label>
          <select 
            name="role"
            value={formData.role} 
            onChange={handleChange} 
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="user">User</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
        <button 
          type="submit" 
          style={{ width: '100%', padding: 10, background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold', marginBottom: 12 }}
        >
          Register
        </button>
        <div style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/" style={{ color: '#1976d2' }}>Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage; 
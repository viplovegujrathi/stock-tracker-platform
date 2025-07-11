import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleForgot = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/forgot-password', { username });
      setMessage('If this user exists, a reset link has been sent.');
    } catch {
      setMessage('Error processing request.');
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button onClick={handleForgot}>Send Reset Link</button>
        {message && <div className="forgot-message">{message}</div>}
        <div className="forgot-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
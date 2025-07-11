import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/signup', { username, password });
      setMessage('Signup successful! You can now log in.');
    } catch {
      setMessage('Signup failed. Try a different username.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Sign Up</button>
        {message && <div className="signup-message">{message}</div>}
        <div className="signup-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
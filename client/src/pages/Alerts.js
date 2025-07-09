// client/src/pages/Alerts.js
import React, { useState } from 'react';
import axios from 'axios';

export default function Alerts() {
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState('');
  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3001/api/subscribe', { phone });
      setFeedback('Subscribed successfully!');
    } catch {
      setFeedback('Subscription failed.');
    }
  };
  return (
    <div>
      <h2>SMS Alerts</h2>
      <input
        type="text"
        placeholder="Phone number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <button onClick={handleSubmit}>Subscribe</button>
      {feedback && <div>{feedback}</div>}
    </div>
  );
}
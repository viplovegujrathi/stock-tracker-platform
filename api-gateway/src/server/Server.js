// server/server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150, signal: 'Buy' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800, signal: 'Sell' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3400, signal: 'Hold' }
];

app.get('/api/stocks', (req, res) => {
  res.json(stocks);
});

app.post('/api/subscribe', (req, res) => {
  // Here you would integrate with an SMS provider
  const { phone } = req.body;
  if (phone) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
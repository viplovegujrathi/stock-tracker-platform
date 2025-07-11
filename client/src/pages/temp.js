import React, { useState } from 'react';

export default function StockSearch() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');

  const fetchStockData = async () => {
    if (!ticker) {
      alert('Please enter a stock ticker');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/stock/${ticker.toUpperCase()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      setStockData(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setStockData(null);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter stock ticker"
      />
      <button onClick={fetchStockData}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {stockData && (
        <div>
          <h2>Stock Data</h2>
          <p>Name: {stockData.name}</p>
          <p>Symbol: {stockData.symbol}</p>
          <p>Price: ${stockData.price}</p>
          <p>Change: {stockData.change}</p>
          <p>Change Percent: {stockData.changePercent}%</p>
        </div>
      )}
    </div>
  );
}
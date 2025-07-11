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
      const response = await fetch(`http://localhost:3002/api/stock/${ticker.toUpperCase()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      console.log('Stock data fetched:', data);
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
        console.log('Fetching stock data for:', stockData);
          <h2>Stock Data for {stockData.ticker}</h2>
          <p>Latest Price: ${stockData.prices?.[stockData.prices.length - 1] || 'N/A'}</p>
          <p>Average Volume: {stockData.averageVolume || 'N/A'}</p>
          <p>Pivot Points: {JSON.stringify(stockData.pivotPoints) || 'N/A'}</p>
          <p>Volatility (ATR): {stockData.volatility || 'N/A'}</p>
          <h3>Signals</h3>
          <ul>
            {stockData.signals?.map((signal, index) => (
              <li key={index}>
                {signal.type.toUpperCase()} on {signal.date} at ${signal.price}
              </li>
            )) || <li>No signals available</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
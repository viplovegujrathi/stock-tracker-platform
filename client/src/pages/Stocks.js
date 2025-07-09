// client/src/pages/Stocks.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3001/api/stocks')
      .then(res => setStocks(res.data));
  }, []);
  return (
    <div>
      <h2>Stocks</h2>
      <table>
        <thead>
          <tr>
            <th>Stock</th><th>Price</th><th>Signal</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.symbol}>
              <td>{stock.name}</td>
              <td>{stock.price}</td>
              <td>{stock.signal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
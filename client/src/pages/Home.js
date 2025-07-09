import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Stock Price',
        data: [],
        borderColor: '#4ea8de',
        backgroundColor: 'rgba(78, 168, 222, 0.2)',
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/stock-prices'); // Replace with your API endpoint
        const data = response.data;

        // Assuming the API returns an array of objects with `date` and `price` fields
        const labels = data.map(item => item.date);
        const prices = data.map(item => item.price);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Stock Price',
              data: prices,
              borderColor: '#4ea8de',
              backgroundColor: 'rgba(78, 168, 222, 0.2)',
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Stock Tracker Platform</h1>
        <nav>
          <Link className="nav-link" to="/stocks">View Stocks</Link>
          <Link className="nav-link" to="/alerts">SMS Alerts</Link>
        </nav>
      </header>
      <main className="home-main">
        <section className="hero-section">
          <h2>Stay Ahead in the Market</h2>
          <p>Track stock prices in real-time and receive instant alerts for critical changes.</p>
          <Link className="cta-button" to="/stocks">Get Started</Link>
        </section>
        <section className="chart-section">
          <h3>Stock Price Trends</h3>
          <Line data={chartData} options={chartOptions} />
        </section>
      </main>
      <footer className="home-footer">
        <p>&copy; 2025 Stock Tracker Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
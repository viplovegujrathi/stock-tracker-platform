import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { debounce } from 'lodash';
import useSWR from 'swr';
import './Home.css';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import StockSearch from './StockSearch';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TestimonialsSection = lazy(() => import('./TestimonialsSection'));
const FAQSection = lazy(() => import('./FAQSection'));
const ContactSection = lazy(() => import('./ContactSection'));

export default function Home() {
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data: stockData, error } = useSWR('http://localhost:3001/api/stock-prices', fetcher);

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
    if (stockData) {
      const labels = stockData.map(item => item.date);
      const prices = stockData.map(item => item.price);

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
    }
  }, [stockData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      decimation: {
        enabled: true,
        algorithm: 'lttb',
        samples: 100,
      },
    },
  };

  const debouncedFetch = useCallback(
    debounce((query) => {
      console.log('Fetching data for:', query);
    }, 300),
    []
  );

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">Stock Tracker</div>
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="header-link">Login</Link>
          <Link to="/signup" className="header-link">Sign Up</Link>
        </nav>
      </header>
      <main className="home-main">
        <h1>Welcome to Stock Tracker Platform</h1>
        <div className="welcome-description">
          <StockSearch />
          <p>Your one-stop solution for managing and analyzing your stock portfolio with ease.</p>
        </div>
        <ul className="features-list">
          <li>
            <span className="feature-icon">🔍</span>
            <div>
              <h3>Real-time Stock Search</h3>
              <p>Search and track stocks in real-time with accurate data.</p>
            </div>
          </li>
          <li>
            <span className="feature-icon">📈</span>
            <div>
              <h3>Personalized Watchlists</h3>
              <p>Create and manage watchlists tailored to your preferences.</p>
            </div>
          </li>
          <li>
            <span className="feature-icon">🔔</span>
            <div>
              <h3>Price Alerts</h3>
              <p>Get notified when stock prices hit your target.</p>
            </div>
          </li>
          <li>
            <span className="feature-icon">📊</span>
            <div>
              <h3>Portfolio Analytics</h3>
              <p>Analyze your portfolio performance with detailed insights.</p>
            </div>
          </li>
        </ul>
        <button className="cta-button">Get Started</button>
      </main>

      <section className="chart-section">
        <h2>Stock Price Chart</h2>
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </Suspense>
      <footer className="home-footer">
        <p>&copy; 2025 Stock Tracker Platform. All rights reserved.</p>
        <div className="social-media">
          <a href="https://facebook.com/in/viplovegujrathi" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
          <a href="https://twitter.com/viplovegujrathi" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
          <a href="https://linkedin.com/in/viplovegujrathi" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
// Fetch real-time stock data from Alpha Vantage
async function getStockData(ticker) {
    const apiKey = 'WSG03J3K07HCRQV1'; // Replace with your Alpha Vantage API key
    const url = https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${apiKey};
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data['Error Message']) {
            throw new Error('Invalid ticker or API error');
        }
        const timeSeries = data['Time Series (5min)'];
        const dates = Object.keys(timeSeries).sort().slice(-30); // Last 30 intervals
        const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
        return { dates, prices };
    } catch (error) {
        console.error('Error fetching stock data:', error);
        alert('Failed to fetch stock data. Please check the ticker or API key.');
        return { dates: [], prices: [] };
    }
}

// Update fetchStockData to use real API
async function fetchStockData() {
console.log('Fetching stock data...');
    const ticker = document.getElementById('ticker').value.toUpperCase();
    if (!ticker) {
        alert('Please enter a stock ticker');
        return;
    }
    const { dates, prices } = await getStockData(ticker);
    if (dates.length === 0) return;

    const { shortMA, longMA, signals } = generateSignals(prices, dates);

    // Render chart (same as original code)
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (window.stockChart) window.stockChart.destroy();
    window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: ${ticker} Price,
                    data: prices,
                    borderColor: '#3498db',
                    fill: false
                },
                {
                    label: '10-day SMA',
                    data: [...Array(10 - 1).fill(null), ...shortMA],
                    borderColor: '#27ae60',
                    fill: false
                },
                {
                    label: '20-day SMA',
                    data: [...Array(20 - 1).fill(null), ...longMA],
                    borderColor: '#e74c3c',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Price ($)' } }
            }
        }
    });

    // Render signals (same as original code)
    renderSignals(signals);
}
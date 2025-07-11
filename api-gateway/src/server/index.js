const express = require('express');
const axios = require('axios');
const app = express();
const port = 3002;
const cors = require('cors');

// Enable CORS
app.use(cors());

// Alpha Vantage API key (free tier)
const apiKey ='2BUZWTM71L8VB5T1';
//const apiKey = 'WSG03J3K07HCRQV1';
//const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'WSG03J3K07HCRQV1'; // Use environment variable or default
// Middleware to serve static files
app.use(express.static('public'));

// Calculate EMA (Exponential Moving Average)
function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    const ema = [prices[0]]; // Start with first price
    for (let i = 1; i < prices.length; i++) {
        ema.push(prices[i] * k + ema[i - 1] * (1 - k));
    }
    return ema;
}

// Calculate MACD
function calculateMACD(prices) {
    const fastEMA = calculateEMA(prices, 12); // 12-period EMA
    const slowEMA = calculateEMA(prices, 26); // 26-period EMA
    const macd = fastEMA.slice(25).map((fast, i) => fast - slowEMA[i + 25]); // Align lengths
    const signal = calculateEMA(macd, 9); // 9-period EMA of MACD
    return { macd, signal };
}

// Generate buy/sell signals from MACD
function generateSignals(prices, dates) {
    const { macd, signal } = calculateMACD(prices);
    const signals = [];
    for (let i = 1; i < macd.length; i++) {
        if (macd[i - 1] <= signal[i - 1] && macd[i] > signal[i]) {
            signals.push({ date: dates[i + 25], type: 'buy', price: prices[i + 25] });
        } else if (macd[i - 1] >= signal[i - 1] && macd[i] < signal[i]) {
            signals.push({ date: dates[i + 25], type: 'sell', price: prices[i + 25] });
        }
    }
    return signals;
}

// Endpoint to fetch stock data
app.get('/api/stock/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    try {
        // Fetch intraday data (price, high, low, volume)
        const intradayResponse = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&outputsize=compact&apikey=${apiKey}`
        );
        if (intradayResponse.data['Error Message']) {
            throw new Error('Invalid ticker or API error');
        }
        const timeSeries = intradayResponse.data['Time Series (5min)'];
        const dates = Object.keys(timeSeries).sort().slice(-60); // Last 60 intervals for MACD
        const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
        const highs = dates.map(date => parseFloat(timeSeries[date]['2. high']));
        const lows = dates.map(date => parseFloat(timeSeries[date]['3. low']));
        const volumes = dates.map(date => parseInt(timeSeries[date]['5. volume']));

        // Calculate average volume (20-period)
        const averageVolume = volumes.slice(-20).reduce((sum, vol) => sum + vol, 0) / 20;

        // Calculate pivot points for resistance/support
        const latestHigh = highs[highs.length - 1];
        const latestLow = lows[lows.length - 1];
        const latestClose = prices[prices.length - 1];
        const pivot = (latestHigh + latestLow + latestClose) / 3;
        const r1 = 2 * pivot - latestLow;
        const s1 = 2 * pivot - latestHigh;
        const r2 = pivot + (latestHigh - latestLow);
        const s2 = pivot - (latestHigh - latestLow);

        // Fetch earnings data
        const earningsResponse = await axios.get(
            `https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${apiKey}`
        );
        const latestEarnings = earningsResponse.data.quarterlyEarnings
            ? earningsResponse.data.quarterlyEarnings[0]
            : {};

        // Generate buy/sell signals using MACD
        const signals = generateSignals(prices, dates);

        // Fetch ATR for volatility
        const atrResponse = await axios.get(
            `https://www.alphavantage.co/query?function=ATR&symbol=${ticker}&interval=daily&time_period=14&apikey=${apiKey}`
        );
        const atr = atrResponse.data['Technical Analysis: ATR'];
        const latestATR = parseFloat(Object.values(atr)[0].ATR);

        // Send combined data
        res.json({
            ticker,
            dates,
            prices,
            highs,
            lows,
            volumes,
            averageVolume,
            pivotPoints: { pivot, r1, s1, r2, s2 },
            earnings: latestEarnings,
            signals,
            volatility: latestATR
        });
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
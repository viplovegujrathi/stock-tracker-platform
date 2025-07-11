const express = require('express');
const axios = require('axios');
const app = express();
const port = 3002;
const cors = require('cors');
app.use(cors());

// Alpha Vantage API key
const apiKey = 'WSG03J3K07HCRQV1'; // Replace with your Alpha Vantage API key

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to fetch stock data
app.get('/api/stock/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    try {
        let intradayResponse = {};
        let macdResponse = {};
        let atrResponse = {};

        // Fetch intraday data
        try {
            intradayResponse = await axios.get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${apiKey}`
            );
            if (!intradayResponse.data || intradayResponse.data['Error Message']) {
                throw new Error('API error while fetching intraday stock data');
            }
            console.log('Intraday Response:', intradayResponse.data);
        } catch (error) {
            console.error('Error while fetching data for intraday response:', error.message);
            return res.status(500).json({ error: 'Failed to fetch intraday stock data' });
        }

        // Fetch MACD data
        try {
            macdResponse = await axios.get(
                `https://www.alphavantage.co/query?function=MACD&symbol=${ticker}&interval=daily&series_type=close&fastperiod=12&slowperiod=26&signalperiod=9&apikey=${apiKey}`
            );
            if (!macdResponse.data || macdResponse.data['Error Message']) {
                throw new Error('API error while fetching MACD data');
            }
            console.log('MACD Response:', macdResponse.data);
        } catch (error) {
            console.error('Error while fetching data for MACD response:', error.message);
            return res.status(500).json({ error: 'Failed to fetch MACD data' });
        }

        // Fetch ATR data
        try {
            atrResponse = await axios.get(
                `https://www.alphavantage.co/query?function=ATR&symbol=${ticker}&interval=daily&time_period=14&apikey=${apiKey}`
            );
            if (!atrResponse.data || atrResponse.data['Error Message']) {
                throw new Error('API error while fetching ATR data');
            }
        } catch (error) {
            console.error('Error while fetching ATR data:', error.message);
            return res.status(500).json({ error: 'Failed to fetch ATR data' });
        }

        // Process and combine data
        const timeSeries = intradayResponse.data['Time Series (5min)'];
        const dates = Object.keys(timeSeries).sort().slice(-30);
        const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
        const highs = dates.map(date => parseFloat(timeSeries[date]['2. high']));
        const lows = dates.map(date => parseFloat(timeSeries[date]['3. low']));
        const volumes = dates.map(date => parseInt(timeSeries[date]['5. volume']));

        const averageVolume = volumes.slice(-20).reduce((sum, vol) => sum + vol, 0) / 20;

        const latestHigh = highs[highs.length - 1];
        const latestLow = lows[lows.length - 1];
        const latestClose = prices[prices.length - 1];
        const pivot = (latestHigh + latestLow + latestClose) / 3;
        const r1 = 2 * pivot - latestLow;
        const s1 = 2 * pivot - latestHigh;
        const r2 = pivot + (latestHigh - latestLow);
        const s2 = pivot - (latestHigh - latestLow);

        const macdData = macdResponse.data['Technical Analysis: MACD'];
        const macdEntries = Object.entries(macdData)
            .map(([date, values]) => ({
                date,
                MACD: parseFloat(values.MACD),
                MACD_Signal: parseFloat(values.MACD_Signal),
                close: prices[prices.length - 1]
            }))
            .slice(-2);
        const signals = [];
        if (macdEntries.length >= 2) {
            const prev = macdEntries[0];
            const curr = macdEntries[1];
            if (prev.MACD <= prev.MACD_Signal && curr.MACD > curr.MACD_Signal) {
                signals.push({ date: curr.date, type: 'buy', price: curr.close });
            } else if (prev.MACD >= prev.MACD_Signal && curr.MACD < curr.MACD_Signal) {
                signals.push({ date: curr.date, type: 'sell', price: curr.close });
            }
        }

        const atr = atrResponse.data['Technical Analysis: ATR'];
        const latestATR = parseFloat(Object.values(atr)[0].ATR);

        res.json({
            ticker,
            dates,
            prices,
            highs,
            lows,
            volumes,
            averageVolume,
            pivotPoints: { pivot, r1, s1, r2, s2 },
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
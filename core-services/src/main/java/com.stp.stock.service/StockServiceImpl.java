
package com.example.stocktracker.service;

import com.example.stocktracker.model.StockSignal;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StockService {

    public List<StockSignal> getSignals() {
        // Mock stock data for demonstration
        List<StockSignal> stocks = new ArrayList<>();
        stocks.add(new StockSignal("AAPL", "Apple Inc.", 150.0, "Buy"));
        stocks.add(new StockSignal("GOOGL", "Alphabet Inc.", 2800.0, "Sell"));
        stocks.add(new StockSignal("AMZN", "Amazon.com Inc.", 3400.0, "Hold"));

        // Add your stock analysis logic here
        // For example, you could fetch real-time stock data from an API and analyze it
        // For now, we return the mock data

        return stocks;
    }
}
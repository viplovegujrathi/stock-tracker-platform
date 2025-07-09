// File: src/main/java/com/example/stocktracker/controller/StockController.java
package com.example.stocktracker.controller;

import com.example.stocktracker.model.StockSignal;
import com.example.stocktracker.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.stp.stock.model.StockSignal;
@RestController
@RequestMapping("/api")
public class StockControllerImpl {

    @Autowired
    private StockService stockService;

    @GetMapping("/stocks")
    public List<StockSignal> getStockSignals() {
        return stockService.getSignals();
    }
}
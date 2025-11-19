
"use client";
import React, { useEffect, useRef } from "react";
import {
  createChart,
  ISeriesApi,
  CandlestickData,
  UTCTimestamp,
  ColorType,
  IChartApi,
} from "lightweight-charts";

interface TradingChartProps {
  source: string;
  pair: string;
  latestPrice: number | null; // NEW: track latest price from parent
}

export default function TradingChart({ source, pair, latestPrice }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lastCandleRef = useRef<CandlestickData<UTCTimestamp> | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // --- Effect 1: Initialize Chart and Fetch Historical Data ---
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart instance
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: "#1e1e1e" },
        textColor: "#d1d4dc",
      },
      grid: { vertLines: { color: "#444" }, horzLines: { color: "#444" } },
      rightPriceScale: { borderColor: "#555" },
      timeScale: { borderColor: "#555", timeVisible: true, secondsVisible: true },
    });
    chartRef.current = chart;

    // Add the candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#4caf50",
      downColor: "#f44336",
      borderUpColor: "#4caf50",
      borderDownColor: "#f44336",
      wickUpColor: "#4caf50",
      wickDownColor: "#f44336",
    });
    candleSeriesRef.current = candleSeries;
    
    // Reset last candle reference for the new chart/pair
    lastCandleRef.current = null;

    // Fetch historical data on load (requires new source/pair)
    const fetchHistoricalData = async () => {
      try {
        const res = await fetch(`/historical?pair=${pair}&source=${source}`);
        const data: { price: number; timestamp: string }[] = await res.json();

        // Convert raw price history into simple "candles" for initial display
        const candles: CandlestickData<UTCTimestamp>[] = data.map((d) => ({
          // Ensure time is UTC Timestamp (seconds)
          time: (Math.floor(new Date(d.timestamp).getTime() / 1000) as UTCTimestamp),
          open: d.price,
          high: d.price,
          low: d.price,
          close: d.price,
        }));

        if (candles.length > 0) {
          candleSeries.setData(candles);
          lastCandleRef.current = candles[candles.length - 1];
        }
      } catch (e) {
        console.error(`Error fetching history for ${source} ${pair}:`, e);
      }
    };

    fetchHistoricalData();


    // Handle resize
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function runs when component unmounts or source/pair changes
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart) {
        chart.remove();
      }
    };
  }, [source, pair]); // Re-run when source or pair changes

  // --- Effect 2: Update Chart on new latestPrice prop ---
  useEffect(() => {
    // Only update if we have a valid price and the series is initialized
    if (latestPrice === null || latestPrice === undefined || !candleSeriesRef.current) return;

    // Use current time as the candle time (in seconds)
    const time = Math.floor(Date.now() / 1000) as UTCTimestamp;
    const lastCandle = lastCandleRef.current;

    let newCandle: CandlestickData<UTCTimestamp>;

    // Check if we need to start a new candle (time has advanced)
    // For a simple real-time tick chart, we update the last candle on every price tick.
    // If the time is different from the last saved time, we assume a new candle starts.
    if (!lastCandle || lastCandle.time < time) {
      // Start a new candle
      newCandle = {
        time,
        open: latestPrice,
        high: latestPrice,
        low: latestPrice,
        close: latestPrice,
      };
    } else {
      // Update existing candle (extend it with the new tick)
      newCandle = {
        time: lastCandle.time,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, latestPrice),
        low: Math.min(lastCandle.low, latestPrice),
        close: latestPrice,
      };
    }

    // Apply the update
    candleSeriesRef.current.update(newCandle);
    lastCandleRef.current = newCandle;
  }, [latestPrice]); // Re-run whenever latestPrice changes

  return <div ref={chartContainerRef} className="w-full h-[300px]" />;
}

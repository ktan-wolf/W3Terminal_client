"use client";
import React, { useEffect, useRef } from "react";
import {
  createChart,
  ISeriesApi,
  CandlestickData,
  UTCTimestamp,
  ColorType,
} from "lightweight-charts";

interface PriceUpdate {
  source: string;
  pair: string;
  price: number;
}

interface TradingChartProps {
  source: "Binance" | "Jupiter" | "Raydium";
  pair: string;
}

export default function TradingChart({ source, pair }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lastCandleRef = useRef<CandlestickData<UTCTimestamp> | null>(null);

  useEffect(() => {
    let ws: WebSocket;

    const initChart = async () => {
      if (!chartContainerRef.current) return;

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

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#4caf50",
        downColor: "#f44336",
        borderUpColor: "#4caf50",
        borderDownColor: "#f44336",
        wickUpColor: "#4caf50",
        wickDownColor: "#f44336",
      });
      candleSeriesRef.current = candleSeries;

      // Fetch historical data
      const res = await fetch(`/api/historical?pair=${pair}&source=${source}`);
      const data: { price: number; timestamp: string }[] = await res.json();

      // ✅ Cast `time` explicitly as UTCTimestamp
      const candles: CandlestickData<UTCTimestamp>[] = data.map((d) => ({
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

      // WebSocket for live updates
      ws = new WebSocket("ws://127.0.0.1:8081/ws/arb");
      ws.onmessage = (event) => {
        const feed = JSON.parse(event.data) as { prices: PriceUpdate[] };
        const update = feed.prices.find((p) => p.source === source);
        if (!update) return;

        const time = Math.floor(Date.now() / 1000) as UTCTimestamp;
        const lastCandle = lastCandleRef.current;

        if (!lastCandle || lastCandle.time < time) {
          const newCandle: CandlestickData<UTCTimestamp> = {
            time,
            open: update.price,
            high: update.price,
            low: update.price,
            close: update.price,
          };
          candleSeriesRef.current?.update(newCandle);
          lastCandleRef.current = newCandle;
        } else {
          const newCandle: CandlestickData<UTCTimestamp> = {
            time: lastCandle.time,
            open: lastCandle.open,
            high: Math.max(lastCandle.high, update.price),
            low: Math.min(lastCandle.low, update.price),
            close: update.price,
          };
          candleSeriesRef.current?.update(newCandle);
          lastCandleRef.current = newCandle;
        }
      };

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
      };
      window.addEventListener("resize", handleResize);
    };

    initChart();

    return () => ws?.close();
  }, [source, pair]);

  return <div ref={chartContainerRef} className="w-full h-[300px]" />;
}

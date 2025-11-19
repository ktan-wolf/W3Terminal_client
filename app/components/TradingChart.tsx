"use client";
import React, { useEffect, useRef } from "react";
import { 
    createChart, 
    ColorType, 
    IChartApi, 
    ISeriesApi, 
    UTCTimestamp,
    CrosshairMode
} from "lightweight-charts";

interface TradingChartProps {
    source: string;
    pair: string;
    latestPrice: number | null;
}

// --- COLOR PALETTES ---
const UP_COLOR = {
    line: "#10b981",                    // Emerald-500
    top: "rgba(16, 185, 129, 0.4)",     // Emerald Gradient Start
    bottom: "rgba(16, 185, 129, 0.0)",  // Transparent End
};

const DOWN_COLOR = {
    line: "#ef4444",                    // Red-500
    top: "rgba(239, 68, 68, 0.4)",      // Red Gradient Start
    bottom: "rgba(239, 68, 68, 0.0)",   // Transparent End
};

export default function TradingChart({ source, pair, latestPrice }: TradingChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
    
    // Track previous price to determine Up/Down direction
    const prevPriceRef = useRef<number | null>(null);

    // 1. Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        chartContainerRef.current.style.minHeight = "240px"; 

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: "#737373",
                fontFamily: "Inter, sans-serif",
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { color: "rgba(255, 255, 255, 0.05)" },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                borderVisible: false,
                rightOffset: 20,      // Space for the "head"
                fixLeftEdge: false,   // Scrolls off screen (Ticker style)
                fixRightEdge: true,   // Snaps to new data
            },
            rightPriceScale: {
                borderVisible: false,
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.1,
                },
            },
            crosshair: {
                mode: CrosshairMode.Magnet,
                vertLine: {
                    color: "rgba(255, 255, 255, 0.1)",
                    style: 3,
                    labelBackgroundColor: "#262626",
                },
                horzLine: {
                    color: "rgba(255, 255, 255, 0.1)",
                    style: 3,
                    labelBackgroundColor: "#262626",
                },
            },
        });

        // Initialize with UP colors by default
        const newSeries = chart.addAreaSeries({
            lineColor: UP_COLOR.line,
            topColor: UP_COLOR.top,
            bottomColor: UP_COLOR.bottom,
            lineWidth: 2,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 4,
        });

        chartRef.current = chart;
        seriesRef.current = newSeries;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ 
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };
        
        const observer = new ResizeObserver(handleResize);
        observer.observe(chartContainerRef.current);

        return () => {
            observer.disconnect();
            chart.remove();
        };
    }, []);

    // 2. Update Logic (Color Switching)
    useEffect(() => {
        if (!seriesRef.current || latestPrice === null) return;

        const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
        const prevPrice = prevPriceRef.current;

        // DETERMINE COLOR
        if (prevPrice !== null) {
            if (latestPrice < prevPrice) {
                // Price went DOWN -> Switch to Red
                seriesRef.current.applyOptions({
                    lineColor: DOWN_COLOR.line,
                    topColor: DOWN_COLOR.top,
                    bottomColor: DOWN_COLOR.bottom,
                });
            } else if (latestPrice > prevPrice) {
                // Price went UP -> Switch to Green
                seriesRef.current.applyOptions({
                    lineColor: UP_COLOR.line,
                    topColor: UP_COLOR.top,
                    bottomColor: UP_COLOR.bottom,
                });
            }
            // If price is equal, we keep the existing color
        }

        // UPDATE CHART DATA
        seriesRef.current.update({
            time: now,
            value: latestPrice,
        });

        // Update history for next comparison
        prevPriceRef.current = latestPrice;

    }, [latestPrice]);

    return <div ref={chartContainerRef} className="w-full h-full min-h-[240px]" />;
}
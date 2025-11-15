
"use client";
import { useEffect, useState } from "react";

interface PriceUpdate {
  source: string;
  pair: string;
  price: number;
}

interface ArbitrageOpportunity {
  pair: string;
  best_buy_source: string;
  best_buy_price: number;
  best_sell_source: string;
  best_sell_price: number;
  spread_percent: number;
}

interface ArbitrageFeed {
  prices: PriceUpdate[];
  opportunity: ArbitrageOpportunity;
}

export default function Home() {
  const [binancePrice, setBinancePrice] = useState<number | null>(null);
  const [jupiterPrice, setJupiterPrice] = useState<number | null>(null);
  const [raydiumPrice, setRaydiumPrice] = useState<number | null>(null);
  const [arb, setArb] = useState<ArbitrageOpportunity | null>(null);

  // Connect to combined WebSocket feed
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8081/ws/arb");

    ws.onmessage = (event) => {
      const data: ArbitrageFeed = JSON.parse(event.data);

      // Update individual prices
      data.prices.forEach((p) => {
        if (p.source === "Binance") setBinancePrice(p.price);
        if (p.source === "Jupiter") setJupiterPrice(p.price);
        if (p.source === "Raydium") setRaydiumPrice(p.price);
      });

      // Update arbitrage opportunity
      setArb(data.opportunity);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-4 text-center space-y-6">
      <h1 className="text-2xl font-bold">SOL Prices</h1>

      <div>
        <h2 className="text-xl font-semibold">Binance SOL/USDT</h2>
        <p className="text-2xl font-bold text-green-600">
          {binancePrice !== null ? `$${binancePrice.toFixed(2)}` : "Loading..."}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Jupiter SOL/USDC</h2>
        <p className="text-2xl font-bold text-green-600">
          {jupiterPrice !== null ? `$${jupiterPrice.toFixed(2)}` : "Loading..."}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Raydium SOL/USDC</h2>
        <p className="text-2xl font-bold text-green-600">
          {raydiumPrice !== null ? `$${raydiumPrice.toFixed(2)}` : "Loading..."}
        </p>
      </div>

      {arb && (
        <div className="mt-8 p-4 border rounded shadow-lg inline-block">
          <h2 className="text-xl font-bold">Arbitrage Opportunity</h2>
          <p>
            Buy on <span className="font-semibold">{arb.best_buy_source}</span> at{" "}
            <span className="font-semibold">${arb.best_buy_price.toFixed(2)}</span>
          </p>
          <p>
            Sell on <span className="font-semibold">{arb.best_sell_source}</span> at{" "}
            <span className="font-semibold">${arb.best_sell_price.toFixed(2)}</span>
          </p>
          <p className="text-green-700 font-bold">
            Spread: {arb.spread_percent.toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}


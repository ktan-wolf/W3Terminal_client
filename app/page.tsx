
"use client";
import { useEffect, useState } from "react";
import TradingChart from "./components/TradingChart";

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

  const [coinbasePrice, setCoinbasePrice] = useState<number | null>(null);
  const [krakenPrice, setKrakenPrice] = useState<number | null>(null);
  const [okxPrice, setOkxPrice] = useState<number | null>(null);
  const [bitfinexPrice, setBitfinexPrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8081/ws/arb");

    ws.onmessage = (event) => {
      const data: ArbitrageFeed = JSON.parse(event.data);

      data.prices.forEach((p) => {
        if (p.source === "Binance") setBinancePrice(p.price);
        if (p.source === "Jupiter") setJupiterPrice(p.price);
        if (p.source === "Raydium") setRaydiumPrice(p.price);

        if (p.source === "Coinbase") setCoinbasePrice(p.price);
        if (p.source === "Kraken") setKrakenPrice(p.price);
        if (p.source === "OKX") setOkxPrice(p.price);
        if (p.source === "Bitfinex") setBitfinexPrice(p.price);
      });

      setArb(data.opportunity);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-6">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-6">SOL Prices</h1>

      {/* GRID OF ALL EXCHANGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Binance */}
        <div>
          <h2 className="text-xl font-semibold">Binance SOL/USDT</h2>
          <p className="text-2xl font-bold text-green-600">
            {binancePrice !== null ? `$${binancePrice.toFixed(2)}` : "Loading..."}
          </p>
          <TradingChart source="Binance" pair="SOL/USDT" />
        </div>

        {/* Jupiter */}
        <div>
          <h2 className="text-xl font-semibold">Jupiter SOL/USDC</h2>
          <p className="text-2xl font-bold text-green-600">
            {jupiterPrice !== null ? `$${jupiterPrice.toFixed(2)}` : "Loading..."}
          </p>
          <TradingChart source="Jupiter" pair="SOL/USDC" />
        </div>

        {/* Raydium */}
        <div>
          <h2 className="text-xl font-semibold">Raydium SOL/USDC</h2>
          <p className="text-2xl font-bold text-green-600">
            {raydiumPrice !== null ? `$${raydiumPrice.toFixed(2)}` : "Loading..."}
          </p>
          <TradingChart source="Raydium" pair="SOL/USDC" />
        </div>

        {/* Coinbase */}
        <div>
          <h2 className="text-xl font-semibold">Coinbase SOL/USD</h2>
          <p className="text-2xl font-bold text-green-600">
            {coinbasePrice !== null ? `$${coinbasePrice.toFixed(2)}` : "Loading..."}
          </p>
          <TradingChart source="Coinbase" pair="SOL/USD" />
        </div>

        {/* Kraken */}
        <div>
          <h2 className="text-xl font-semibold">Kraken SOL/USD</h2>
          <p className="text-2xl font-bold text-green-600">
            {krakenPrice !== null ? `$${krakenPrice.toFixed(2)}` : "Loading..."}
          </p>
          <TradingChart source="Kraken" pair="SOL/USD" />
        </div>

        {/* OKX */}
        <div>
          <h2 className="text-xl font-semibold">OKX SOL/USDT</h2>
          <p className="text-2xl font-bold text-green-600">
            {okxPrice !== null ? `$${okxPrice.toFixed(2)}` : "Loading..."}
          </p>
          <TradingChart source="OKX" pair="SOL/USDT" />
        </div>

        {/* Bitfinex */}
        <div>
          <h2 className="text-xl font-semibold">Bitfinex SOL/USD</h2>
          <p className="text-2xl font-bold text-green-600">
            {bitfinexPrice !== null ? `$${bitfinexPrice.toFixed(2)}` : "Loading..."}
          </p>
          <TradingChart source="Bitfinex" pair="SOL/USD" />
        </div>

      </div>

      {/* Arbitrage Box */}
      {arb && arb.spread_percent != null && (
        <div className="mt-10 p-4 border rounded shadow-lg inline-block">
          <h2 className="text-xl font-bold">Arbitrage Opportunity</h2>
          <p>
            Buy on <span className="font-semibold">{arb.best_buy_source}</span> @{" "}
            <span className="font-semibold">${arb.best_buy_price.toFixed(2)}</span>
          </p>
          <p>
            Sell on <span className="font-semibold">{arb.best_sell_source}</span> @{" "}
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


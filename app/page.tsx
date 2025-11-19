"use client";
import { useEffect, useState, useRef, useCallback } from "react";
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

// List of all exchanges/sources to display
const ALL_SOURCES = [
    "Binance", "Coinbase", "Kraken", "OKX", "Bitfinex", "Bybit", "KuCoin",
    "Bitget", "HTX", "Backpack", "Jupiter", "Raydium", "Orca"
];

export default function Home() {
    // State to hold prices from various sources
    const [prices, setPrices] = useState<Record<string, number | null>>({});
    const [arb, setArb] = useState<ArbitrageOpportunity | null>(null);

    // State for user input
    const [tokenA, setTokenA] = useState<string>("SOL");
    const [tokenB, setTokenB] = useState<string>("USDC");
    const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");

    // Ref to hold the current WebSocket instance
    const wsRef = useRef<WebSocket | null>(null);

    // Function to handle price updates from the WebSocket
    const handlePriceUpdate = useCallback((data: ArbitrageFeed) => {
        const newPrices: Record<string, number | null> = {};

        data.prices.forEach((p) => {
            newPrices[p.source] = p.price;
        });

        // Use functional state update to merge new prices with existing ones
        setPrices(prevPrices => ({ ...prevPrices, ...newPrices }));
        setArb(data.opportunity);
    }, []);

    // Function to establish connection and send subscription message
    const fetchPrices = useCallback(() => {
        // 1. Close existing connection if any
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const ws = new WebSocket("ws://127.0.0.1:8081/ws/subscribe");
        wsRef.current = ws;
        setConnectionStatus("Connecting...");
        setPrices({}); // Clear previous prices

        ws.onopen = () => {
            setConnectionStatus("Subscribed");
            console.log(`[Frontend] WS connected. Sending request for ${tokenA}/${tokenB}`);

            // 2. Send the required JSON message to the backend
            const subscribeMessage = JSON.stringify({
                token_a: tokenA,
                token_b: tokenB,
            });
            ws.send(subscribeMessage);
        };

        ws.onmessage = (event) => {
            try {
                const data: ArbitrageFeed = JSON.parse(event.data);
                handlePriceUpdate(data);
            } catch (e) {
                console.error("Error parsing WS message:", e);
            }
        };

        ws.onclose = () => {
            setConnectionStatus("Disconnected");
            console.log("[Frontend] WS closed.");
        };

        ws.onerror = (err) => {
            setConnectionStatus("Error");
            console.error("[Frontend] WS Error:", err);
        };

    }, [tokenA, tokenB, handlePriceUpdate]);

    // Initial connection attempt on component mount
    useEffect(() => {
        fetchPrices();
        // Cleanup function closes the WebSocket when the component unmounts
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [fetchPrices]); // Re-run effect when fetchPrices changes (i.e., tokenA/tokenB change)


    // Dynamically construct the requested pair string for display
    const currentPair = `${tokenA.toUpperCase()}/${tokenB.toUpperCase()}`;


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Web3 Arbitrage Terminal</h1>
            <p className={`mb-6 text-sm font-medium ${connectionStatus === 'Subscribed' ? 'text-green-500' : 'text-red-500'}`}>
                Connection Status: {connectionStatus} for {currentPair}
            </p>

            {/* --- INPUT CONTROLS --- */}
            <div className="mb-10 p-4 border rounded bg-gray-50 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
                <input
                    type="text"
                    value={tokenA}
                    onChange={(e) => setTokenA(e.target.value.toUpperCase())}
                    placeholder="Token A (e.g., BTC)"
                    className="p-2 border rounded w-full md:w-auto"
                />
                <span className="text-gray-500">/</span>
                <input
                    type="text"
                    value={tokenB}
                    onChange={(e) => setTokenB(e.target.value.toUpperCase())}
                    placeholder="Token B (e.g., USDC)"
                    className="p-2 border rounded w-full md:w-auto"
                />
                <button
                    onClick={fetchPrices}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
                >
                    Fetch Prices
                </button>
            </div>

            {/* --- ARBITRAGE BOX --- */}
            {arb && arb.spread_percent !== null && (
                <div className="mt-6 mb-10 p-4 border rounded shadow-lg inline-block bg-yellow-50 border-yellow-300">
                    <h2 className="text-xl font-bold mb-2">Arbitrage Opportunity: {arb.pair}</h2>
                    <p>
                        Buy on <span className="font-semibold text-blue-600">{arb.best_buy_source}</span> @{" "}
                        <span className="font-semibold">${arb.best_buy_price.toFixed(4)}</span>
                    </p>
                    <p>
                        Sell on <span className="font-semibold text-red-600">{arb.best_sell_source}</span> @{" "}
                        <span className="font-semibold">${arb.best_sell_price.toFixed(4)}</span>
                    </p>
                    <p className="text-green-700 font-bold mt-2">
                        Spread: {arb.spread_percent.toFixed(4)}%
                    </p>
                </div>
            )}

            {/* --- PRICE GRID (Dynamically renders all charts with their specific price) --- */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ALL_SOURCES
                    .filter((exchange) => prices[exchange] !== undefined && prices[exchange] !== null)
                    .map((exchange) => (
                        <div key={exchange}>
                            <h2 className="text-xl font-semibold">{exchange} {currentPair}</h2>

                            <p className="text-2xl font-bold text-green-600">
                                ${prices[exchange]!.toFixed(4)}
                            </p>

                            <TradingChart
                                source={exchange}
                                pair={currentPair}
                                latestPrice={prices[exchange] ?? null}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
}

"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import TradingChart from "./components/TradingChart";
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  TrendingUp, 
  ArrowRightLeft, 
  Activity 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- COMPONENTS (Card, Badge, BackgroundBeams) ---
// ... (Keep your existing Card, Badge, and BackgroundBeams components exactly as they were) ...

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl", className)}>
    {children}
  </div>
);

const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full bg-neutral-950 overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute h-[100vh] w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
};

// --- TYPES ---

interface PriceUpdate {
    source: string;
    pair: string;
    price: number;
    timestamp?: number;
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

// Exchange list
const ALL_SOURCES = [
    "Binance", "Coinbase", "Kraken", "OKX", "Bitfinex", "Bybit", "KuCoin",
    "Bitget", "HTX", "Backpack", "Jupiter", "Raydium", "Orca"
];

export default function Home() {
    // State
    const [prices, setPrices] = useState<Record<string, number | null>>({});
    const [arb, setArb] = useState<ArbitrageOpportunity | null>(null);
    const [tokenA, setTokenA] = useState<string>("SOL");
    const [tokenB, setTokenB] = useState<string>("USDC");
    const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
    const [isConnecting, setIsConnecting] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);

    // Helper to update prices map from a list of updates
    const updatePriceMap = useCallback((updates: PriceUpdate[]) => {
        setPrices(prev => {
            const next = { ...prev };
            updates.forEach(u => {
                next[u.source] = u.price;
            });
            return next;
        });
    }, []);

    const fetchPrices = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const ws = new WebSocket("ws://127.0.0.1:8081/ws/subscribe");
        wsRef.current = ws;
        setConnectionStatus("Connecting...");
        setIsConnecting(true);
        setPrices({}); // Clear old prices on new connection

        ws.onopen = () => {
            setConnectionStatus("Subscribed");
            setIsConnecting(false);
            const subscribeMessage = JSON.stringify({ token_a: tokenA, token_b: tokenB });
            ws.send(subscribeMessage);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // --- LOGIC UPDATE: Handle History vs Live ---
                if (Array.isArray(data)) {
                    // Case 1: It's the HISTORY buffer (PriceUpdate[])
                    // We just update the prices map so the chart has data points
                    updatePriceMap(data);
                } else {
                    // Case 2: It's a LIVE ArbitrageFeed
                    const feed = data as ArbitrageFeed;
                    updatePriceMap(feed.prices);
                    setArb(feed.opportunity);
                }
            } catch (e) {
                console.error("Error parsing WS message:", e);
            }
        };

        ws.onclose = () => {
            setConnectionStatus("Disconnected");
            setIsConnecting(false);
        };

        ws.onerror = (err) => {
            setConnectionStatus("Error");
            setIsConnecting(false);
            console.error("WS Error:", err);
        };

    }, [tokenA, tokenB, updatePriceMap]);

    useEffect(() => {
        fetchPrices();
        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, [fetchPrices]);

    const currentPair = `${tokenA.toUpperCase()}/${tokenB.toUpperCase()}`;

    return (
        <div className="min-h-screen w-full relative text-neutral-200 font-sans selection:bg-indigo-500/30">
            <BackgroundBeams />
            <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 tracking-tight">
                            AetherNet <span className="font-light text-indigo-400">ArbTerminal</span>
                        </h1>
                        <p className="text-neutral-400 mt-2 flex items-center gap-2 text-sm">
                            <Activity className="w-4 h-4" /> 
                            In-Memory High Frequency Monitor
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                         <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium backdrop-blur-sm transition-colors", 
                            connectionStatus === 'Subscribed' 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                         )}>
                            {connectionStatus === 'Subscribed' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                            {connectionStatus}
                        </div>
                    </div>
                </div>

                {/* CONTROL BAR */}
                <Card className="p-1">
                    <div className="flex flex-col md:flex-row gap-2 p-2">
                        {/* INPUTS */}
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={tokenA}
                                onChange={(e) => setTokenA(e.target.value.toUpperCase())}
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-lg py-3 pl-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="BTC"
                            />
                        </div>
                        <div className="flex items-center justify-center text-neutral-600"><ArrowRightLeft className="w-5 h-5" /></div>
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={tokenB}
                                onChange={(e) => setTokenB(e.target.value.toUpperCase())}
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-lg py-3 pl-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="USDC"
                            />
                        </div>
                        <button
                            onClick={fetchPrices}
                            disabled={isConnecting}
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-lg transition-all"
                        >
                            <RefreshCw className={cn("w-4 h-4", isConnecting && "animate-spin")} />
                            {isConnecting ? "Syncing..." : "Update Stream"}
                        </button>
                    </div>
                </Card>

                {/* ARBITRAGE CARD (Only shows when spread > 0) */}
                {arb && arb.spread_percent > 0 && (
                    <Card className="relative p-6 md:p-8 bg-neutral-900/90 border-indigo-500/30">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <div className="text-sm text-indigo-400 font-bold mb-1">ARBITRAGE DETECTED</div>
                                <div className="text-4xl font-bold text-white">{arb.spread_percent.toFixed(3)}% Spread</div>
                                <div className="text-neutral-500 font-mono text-sm mt-1">{arb.pair}</div>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="flex-1 p-4 bg-emerald-950/30 border border-emerald-500/20 rounded text-center">
                                    <div className="text-xs text-emerald-400 font-bold">BUY LOW ({arb.best_buy_source})</div>
                                    <div className="text-lg font-mono text-white">${arb.best_buy_price.toFixed(4)}</div>
                                </div>
                                <div className="flex-1 p-4 bg-red-950/30 border border-red-500/20 rounded text-center">
                                    <div className="text-xs text-red-400 font-bold">SELL HIGH ({arb.best_sell_source})</div>
                                    <div className="text-lg font-mono text-white">${arb.best_sell_price.toFixed(4)}</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* MARKET GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ALL_SOURCES
                        .filter((exchange) => prices[exchange] !== undefined && prices[exchange] !== null)
                        .map((exchange) => (
                            <Card key={exchange} className="p-5 hover:bg-neutral-800/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-lg font-bold text-white">{exchange}</h2>
                                    <p className="text-xl font-bold text-emerald-400 font-mono">${prices[exchange]!.toFixed(4)}</p>
                                </div>
                                <div className="h-[240px] w-full mt-2 rounded overflow-hidden">
                                    <TradingChart
                                        source={exchange}
                                        pair={currentPair}
                                        latestPrice={prices[exchange] ?? null}
                                    />
                                </div>
                            </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
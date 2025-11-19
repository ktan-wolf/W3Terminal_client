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

// --- UI COMPONENTS ---

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl", className)}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "danger" | "warning" }) => {
  const variants = {
    default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", variants[variant])}>
      {children}
    </span>
  );
};

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
    // State
    const [prices, setPrices] = useState<Record<string, number | null>>({});
    const [arb, setArb] = useState<ArbitrageOpportunity | null>(null);
    const [tokenA, setTokenA] = useState<string>("SOL");
    const [tokenB, setTokenB] = useState<string>("USDC");
    const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
    const [isConnecting, setIsConnecting] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);

    const handlePriceUpdate = useCallback((data: ArbitrageFeed) => {
        const newPrices: Record<string, number | null> = {};
        data.prices.forEach((p) => {
            newPrices[p.source] = p.price;
        });
        setPrices(prevPrices => ({ ...prevPrices, ...newPrices }));
        setArb(data.opportunity);
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
        setPrices({});

        ws.onopen = () => {
            setConnectionStatus("Subscribed");
            setIsConnecting(false);
            const subscribeMessage = JSON.stringify({ token_a: tokenA, token_b: tokenB });
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
            setIsConnecting(false);
        };

        ws.onerror = (err) => {
            setConnectionStatus("Error");
            setIsConnecting(false);
            console.error("WS Error:", err);
        };

    }, [tokenA, tokenB, handlePriceUpdate]);

    useEffect(() => {
        fetchPrices();
        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, [fetchPrices]);

    const currentPair = `${tokenA.toUpperCase()}/${tokenB.toUpperCase()}`;

    return (
        <div className="min-h-screen w-full relative text-neutral-200 font-sans selection:bg-indigo-500/30">
            {/* Animated Background */}
            <BackgroundBeams />

            {/* Main Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 tracking-tight">
                            AetherNet <span className="font-light text-indigo-400">ArbTerminal</span>
                        </h1>
                        <p className="text-neutral-400 mt-2 flex items-center gap-2 text-sm">
                            <Activity className="w-4 h-4" /> 
                            Real-time Cross-CEX/DEX Arbitrage Monitor
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

                {/* --- CONTROL BAR --- */}
                <Card className="p-1">
                    <div className="flex flex-col md:flex-row gap-2 p-2">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
                                <span className="text-xs font-bold">BASE</span>
                            </div>
                            <input
                                type="text"
                                value={tokenA}
                                onChange={(e) => setTokenA(e.target.value.toUpperCase())}
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
                                placeholder="BTC"
                            />
                        </div>

                        <div className="flex items-center justify-center text-neutral-600">
                            <ArrowRightLeft className="w-5 h-5" />
                        </div>

                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
                                <span className="text-xs font-bold">QUOTE</span>
                            </div>
                            <input
                                type="text"
                                value={tokenB}
                                onChange={(e) => setTokenB(e.target.value.toUpperCase())}
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
                                placeholder="USDC"
                            />
                        </div>

                        <button
                            onClick={fetchPrices}
                            disabled={isConnecting}
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
                        >
                            <RefreshCw className={cn("w-4 h-4", isConnecting && "animate-spin")} />
                            {isConnecting ? "Syncing..." : "Update Stream"}
                        </button>
                    </div>
                </Card>

                {/* --- ARBITRAGE HERO SECTION --- */}
                {arb && arb.spread_percent !== null ? (
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <Card className="relative p-6 md:p-8 flex flex-col md:flex-row justify-between items-center bg-neutral-900/90">
                            <div className="flex flex-col gap-2 mb-4 md:mb-0">
                                <div className="flex items-center gap-2">
                                    <Badge variant="success">Opportunity Detected</Badge>
                                    <span className="text-neutral-400 text-sm font-mono">{arb.pair}</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold text-white tracking-tighter">
                                        {arb.spread_percent.toFixed(3)}%
                                    </span>
                                    <span className="text-neutral-400 font-medium">Spread</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="flex-1 p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-center">
                                    <div className="text-xs text-emerald-400 uppercase font-bold tracking-wider mb-1">Buy Low</div>
                                    <div className="text-lg font-bold text-white">{arb.best_buy_source}</div>
                                    <div className="text-emerald-400 font-mono">${arb.best_buy_price.toFixed(4)}</div>
                                </div>
                                <div className="hidden md:flex text-neutral-500">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div className="flex-1 p-4 rounded-lg bg-red-950/30 border border-red-500/20 text-center">
                                    <div className="text-xs text-red-400 uppercase font-bold tracking-wider mb-1">Sell High</div>
                                    <div className="text-lg font-bold text-white">{arb.best_sell_source}</div>
                                    <div className="text-red-400 font-mono">${arb.best_sell_price.toFixed(4)}</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-12 rounded-xl border border-white/5 bg-neutral-900/30 border-dashed">
                        <p className="text-neutral-500">Waiting for arbitrage opportunities...</p>
                    </div>
                )}

                {/* --- MARKET GRID (2 COLUMNS) --- */}
                <div>
                     <h3 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" /> 
                        Live Market Feed
                    </h3>
                    
                    {/* CHANGED: grid-cols-1 md:grid-cols-2 ONLY (removed lg:grid-cols-3) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ALL_SOURCES
                            .filter((exchange) => prices[exchange] !== undefined && prices[exchange] !== null)
                            .map((exchange) => (
                                <Card key={exchange} className="p-5 hover:bg-neutral-800/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{exchange}</h2>
                                            <p className="text-xs text-neutral-500 font-mono">{currentPair}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-emerald-400 font-mono tracking-tight">
                                                ${prices[exchange]!.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CHANGED: Height increased to h-[240px] for better visibility */}
                                    <div className="h-[240px] w-full mt-2 rounded overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
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
        </div>
    );
}
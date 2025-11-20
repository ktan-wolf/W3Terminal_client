"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import TradingChart from "./components/TradingChart";
import ExchangeLogo from "./components/ExchangeLogo";
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  TrendingUp, 
  ArrowRightLeft, 
  Activity,
  Zap,
  Target,
  Radio,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- CYBERPUNK PREMIUM COMPONENTS ---

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = '01';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = i % 3 === 0 ? '#0ff' : '#00ff41';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 opacity-[0.03]" />;
};

const CyberGrid = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Perspective grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(rgba(0, 255, 255, 0.03) 2px, transparent 2px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.03) 2px, transparent 2px),
        linear-gradient(rgba(0, 255, 255, 0.01) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.01) 1px, transparent 1px)
      `,
      backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
      transform: 'perspective(500px) rotateX(60deg)',
      transformOrigin: 'center top',
    }}></div>
    
    {/* Animated scan lines */}
    <div className="absolute inset-0">
      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan-line"></div>
      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-scan-line-2"></div>
    </div>
    
    {/* Holographic light beams */}
    <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent blur-sm"></div>
    <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-purple-500/20 via-transparent to-transparent blur-sm"></div>
  </div>
);

const HolographicCard = ({ children, className, featured }: { children: React.ReactNode; className?: string; featured?: boolean }) => (
  <div className={cn("group relative", className)}>
    {/* Animated border gradient */}
    <div className={cn(
      "absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm",
      featured 
        ? "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-border-flow"
        : "bg-gradient-to-r from-cyan-500/50 to-purple-500/50"
    )}></div>
    
    {/* Main card */}
    <div className="relative rounded-2xl bg-black/80 backdrop-blur-2xl border border-cyan-500/20 overflow-hidden">
      {/* Holographic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/30"></div>
      
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  </div>
);

const GlitchText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative inline-block", className)}>
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 text-cyan-500 opacity-50 animate-glitch-1" aria-hidden>{children}</span>
    <span className="absolute inset-0 text-purple-500 opacity-50 animate-glitch-2" aria-hidden>{children}</span>
  </div>
);

const NeonButton = ({ children, onClick, disabled, variant = "primary" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "relative px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider overflow-hidden group transition-all duration-300",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variant === "primary" && "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)]",
      "active:scale-95 hover:scale-105"
    )}
  >
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
    
    {/* Corner highlights */}
    <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </button>
);

const DataStream = ({ label, value, trend }: { label: string; value: string; trend?: 'up' | 'down' }) => (
  <div className="flex items-center justify-between py-3 border-b border-cyan-500/10 group hover:border-cyan-500/30 transition-colors">
    <span className="text-cyan-400/60 text-xs uppercase tracking-wider font-mono">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-white font-mono font-bold">{value}</span>
      {trend && (
        <div className={cn(
          "w-0 h-0 border-l-[4px] border-r-[4px] border-l-transparent border-r-transparent",
          trend === 'up' ? "border-b-[6px] border-b-emerald-400" : "border-t-[6px] border-t-red-400"
        )}></div>
      )}
    </div>
  </div>
);

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

const ALL_SOURCES = [
    "Binance", "Coinbase", "Kraken", "OKX", "Bitfinex", "Bybit", "KuCoin",
    "Bitget", "HTX", "Backpack", "Jupiter", "Raydium", "Orca"
];



export default function Home() {
    const [prices, setPrices] = useState<Record<string, number | null>>({});
    const [arb, setArb] = useState<ArbitrageOpportunity | null>(null);
    const [tokenA, setTokenA] = useState<string>("SOL");
    const [tokenB, setTokenB] = useState<string>("USDC");
    const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
    const [isConnecting, setIsConnecting] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);

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
        setPrices({});

        ws.onopen = () => {
            setConnectionStatus("Subscribed");
            setIsConnecting(false);
            const subscribeMessage = JSON.stringify({ token_a: tokenA, token_b: tokenB });
            ws.send(subscribeMessage);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (Array.isArray(data)) {
                    updatePriceMap(data);
                } else {
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
    const isConnected = connectionStatus === 'Subscribed';

    return (
        <div className="min-h-screen px-20 w-full relative bg-black text-white font-mono overflow-x-hidden">
            {/* Animated background layers */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
                <CyberGrid />
                <MatrixRain />
            </div>
            
            <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-8">
                
                {/* FUTURISTIC HEADER */}
                <div className="mb-12">
                    <div className="flex items-start justify-between mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 animate-pulse"></div>
                                    <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center border-2 border-cyan-400/50">
                                        <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div>
                                    <GlitchText>
                                        <h1 className="text-6xl font-black tracking-tighter">
                                            <span className="text-cyan-400">AETHER</span>
                                            <span className="text-purple-400">NET</span>
                                        </h1>
                                    </GlitchText>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="h-px w-12 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                                        <p className="text-cyan-400/60 text-sm uppercase tracking-widest font-bold">
                                            Quantum Arbitrage Engine
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 pl-20">
                                <div className="flex items-center gap-2 text-xs">
                                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                                    <span className="text-cyan-400 font-bold">REAL-TIME SYNC</span>
                                </div>
                                <div className="h-4 w-px bg-cyan-500/30"></div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Target className="w-4 h-4 text-purple-400" />
                                    <span className="text-purple-400 font-bold">13 EXCHANGES</span>
                                </div>
                                <div className="h-4 w-px bg-cyan-500/30"></div>
                                <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded text-xs font-bold text-cyan-300">
                                    v2.0.1 NEURAL
                                </div>
                            </div>
                        </div>
                        
                        {/* Connection Status Terminal */}
                        <div className="relative ">
                            <div className={cn(
                                "relative px-6 py-3 rounded-lg border-2 backdrop-blur-sm transition-all duration-300",
                                isConnected 
                                    ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                    : "border-red-400 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                            )}>
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "relative w-3 h-3 rounded-full",
                                        isConnected ? "bg-emerald-400" : "bg-red-400"
                                    )}>
                                        {isConnected && (
                                            <>
                                                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
                                                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse"></span>
                                            </>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-sm font-black uppercase tracking-wider",
                                        isConnected ? "text-emerald-400" : "text-red-400"
                                    )}>
                                        {connectionStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Control Terminal */}
                    <HolographicCard className="w-full max-w-[1050px] mx-auto px-4">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
                                <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Trading Pair Configuration</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto] gap-6 items-end">
                                <div>
                                    <label className="block text-cyan-400/60 text-[10px] uppercase tracking-widest mb-3 font-bold">
                                        BASE ASSET
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity"></div>
                                        <input
                                            type="text"
                                            value={tokenA}
                                            onChange={(e) => setTokenA(e.target.value.toUpperCase())}
                                            className="relative w-full bg-black/90 border border-cyan-500/30 rounded-lg py-4 px-6 text-2xl font-black text-cyan-400 focus:outline-none focus:border-cyan-400 transition-all placeholder:text-cyan-900"
                                            placeholder="BTC"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center pb-2">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                                        <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-purple-400/60 text-[10px] uppercase tracking-widest mb-3 font-bold">
                                        QUOTE ASSET
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity"></div>
                                        <input
                                            type="text"
                                            value={tokenB}
                                            onChange={(e) => setTokenB(e.target.value.toUpperCase())}
                                            className="relative w-full bg-black/90 border border-purple-500/30 rounded-lg py-4 px-6 text-2xl font-black text-purple-400 focus:outline-none focus:border-purple-400 transition-all placeholder:text-purple-900"
                                            placeholder="USDC"
                                        />
                                    </div>
                                </div>
                                
                                <NeonButton onClick={fetchPrices} disabled={isConnecting}>
                                    <RefreshCw className={cn("w-5 h-5", isConnecting && "animate-spin")} />
                                    {isConnecting ? "SYNCING" : "SYNC"}
                                </NeonButton>
                            </div>
                        </div>
                    </HolographicCard>
                </div>

                {/* ARBITRAGE ALERT - COMPACT */}
                {arb && arb.spread_percent > 0 && (
                    <div className="mb-8 w-full max-w-[1050px] mx-auto px-4">
                        <HolographicCard featured className="overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
                            <div className="relative p-5">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    {/* Spread Indicator */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-cyan-400 blur-lg animate-pulse"></div>
                                            <Target className="relative w-7 h-7 text-cyan-400 animate-spin-slow" />
                                        </div>
                                        <div>
                                            <div className="text-cyan-400 text-[10px] uppercase tracking-widest font-black mb-1 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                                                OPPORTUNITY
                                            </div>
                                            <div className="text-4xl font-black tabular-nums">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">
                                                    {arb.spread_percent.toFixed(3)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 ml-auto">
                                        {/* Buy Signal */}
                                        <div className="w-52 relative group">
                                            <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg opacity-30 group-hover:opacity-60 blur-sm transition-opacity"></div>
                                            <div className="relative bg-black/90 border border-emerald-500/40 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-emerald-400 text-[10px] uppercase tracking-widest font-black">
                                                        BUY
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-black text-emerald-400 mb-1 tabular-nums">
                                                    ${arb.best_buy_price.toFixed(4)}
                                                </div>
                                                <div className="text-emerald-400/60 text-xs font-bold">
                                                    {arb.best_buy_source}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Sell Signal */}
                                        <div className="w-52 relative group">
                                            <div className="absolute -inset-[1px] bg-gradient-to-br from-red-500 to-pink-500 rounded-lg opacity-30 group-hover:opacity-60 blur-sm transition-opacity"></div>
                                            <div className="relative bg-black/90 border border-red-500/40 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                                                    <span className="text-red-400 text-[10px] uppercase tracking-widest font-black">
                                                        SELL
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-black text-red-400 mb-1 tabular-nums">
                                                    ${arb.best_sell_price.toFixed(4)}
                                                </div>
                                                <div className="text-red-400/60 text-xs font-bold">
                                                    {arb.best_sell_source}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                            </div>
                        </HolographicCard>
                    </div>
                )}

                {/* MARKET SURVEILLANCE GRID */}
                <div className="space-y-6 w-full max-w-[1050px] mx-auto px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-purple-500"></div>
                        <h2 className="text-2xl font-black uppercase tracking-wider">
                            <span className="text-cyan-400">Market</span>
                            <span className="text-purple-400 ml-2">Surveillance</span>
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 via-purple-500/30 to-transparent"></div>
                        <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-sm font-bold">
                            {Object.keys(prices).length} ACTIVE
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                        {ALL_SOURCES
                            .filter((exchange) => prices[exchange] !== undefined && prices[exchange] !== null)
                            .map((exchange, index) => (
                                <HolographicCard 
                                    key={exchange}
                                    className="transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="p-6">
                                        {/* Exchange Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <ExchangeLogo exchange={exchange} />
                                                    <h3 className="text-xl font-black text-cyan-400">
                                                        {exchange.toUpperCase()}
                                                    </h3>
                                                </div>
                                                <p className="text-cyan-400/40 text-[10px] uppercase tracking-widest font-bold">
                                                    {currentPair}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black text-white tabular-nums mb-1">
                                                    ${prices[exchange]!.toFixed(4)}
                                                </div>
                                                <div className="inline-flex px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400 text-[10px] font-black">
                                                    LIVE
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Chart */}
                                        <div className="relative h-[240px] w-full rounded-lg overflow-hidden border border-cyan-500/20 bg-black/50">
                                            <TradingChart
                                                source={exchange}
                                                pair={currentPair}
                                                latestPrice={prices[exchange] ?? null}
                                            />
                                        </div>
                                    </div>
                                </HolographicCard>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Custom Keyframe Animations */}
            <style jsx global>{`
                @keyframes scan-line {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes scan-line-2 {
                    0% { top: 100%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 0%; opacity: 0; }
                }
                @keyframes border-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes glitch-1 {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                }
                @keyframes glitch-2 {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(2px, -2px); }
                    40% { transform: translate(2px, 2px); }
                    60% { transform: translate(-2px, -2px); }
                    80% { transform: translate(-2px, 2px); }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-scan-line {
                    animation: scan-line 8s linear infinite;
                }
                .animate-scan-line-2 {
                    animation: scan-line-2 10s linear infinite;
                }
                .animate-border-flow {
                    background-size: 200% 200%;
                    animation: border-flow 3s ease infinite;
                }
                .animate-glitch-1 {
                    animation: glitch-1 0.3s infinite;
                }
                .animate-glitch-2 {
                    animation: glitch-2 0.3s infinite;
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 4s linear infinite;
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
import React, { useState } from 'react';

interface ExchangeLogoProps {
  exchange: string;
}

// Logo mapping - you can replace these URLs with your own logo sources
const LOGO_SOURCES: Record<string, string> = {
  Binance: "/logos/binance.png",
  Coinbase: "/logos/coinbase.png",
  Kraken: "/logos/kraken.png",
  OKX: "/logos/OKX.png",
  Bitfinex: "/logos/bitfinex.png",
  Bybit: "/logos/bybit.png",
  KuCoin: "/logos/kucoin.png",
  Bitget: "/logos/bitget.png",
  HTX: "/logos/htx.png",
  Backpack: "/logos/backpack.png",
  Jupiter: "/logos/jupiter.png",
  Raydium: "/logos/raydium.png",
  Orca: "/logos/orca.png"
};

// Fallback colors for gradient backgrounds when logo fails
const FALLBACK_COLORS: Record<string, { from: string; to: string }> = {
  Binance: { from: "from-yellow-500", to: "to-yellow-600" },
  Coinbase: { from: "from-blue-500", to: "to-blue-600" },
  Kraken: { from: "from-purple-500", to: "to-purple-600" },
  OKX: { from: "from-gray-600", to: "to-gray-700" },
  Bitfinex: { from: "from-green-500", to: "to-green-600" },
  Bybit: { from: "from-yellow-500", to: "to-orange-500" },
  KuCoin: { from: "from-green-400", to: "to-green-600" },
  Bitget: { from: "from-blue-400", to: "to-cyan-500" },
  HTX: { from: "from-blue-500", to: "to-blue-700" },
  Backpack: { from: "from-orange-500", to: "to-red-500" },
  Jupiter: { from: "from-cyan-400", to: "to-blue-500" },
  Raydium: { from: "from-purple-500", to: "to-pink-500" },
  Orca: { from: "from-cyan-400", to: "to-teal-500" }
};

const ExchangeLogo: React.FC<ExchangeLogoProps> = ({ exchange }) => {
  const [hasError, setHasError] = useState(false);
  const logoUrl = LOGO_SOURCES[exchange];
  const fallbackColor = FALLBACK_COLORS[exchange] || { from: "from-cyan-500", to: "to-purple-500" };

  // If logo failed to load or doesn't exist, show fallback
  if (hasError || !logoUrl) {
    return (
      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${fallbackColor.from} ${fallbackColor.to} flex items-center justify-center text-white text-xs font-black shadow-lg`}>
        {exchange[0]}
      </div>
    );
  }

  return (
    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/10 border border-cyan-500/30 shadow-lg">
      <img 
        src={logoUrl}
        alt={`${exchange} logo`}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default ExchangeLogo;
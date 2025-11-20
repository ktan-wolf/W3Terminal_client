import React, { useState } from 'react';

interface ExchangeLogoProps {
  exchange: string;
}

// Logo mapping - you can replace these URLs with your own logo sources
const LOGO_SOURCES: Record<string, string> = {
  Binance: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  Coinbase: "https://cryptologos.cc/logos/coinbase-coin-usdc-logo.png",
  Kraken: "https://seeklogo.com/images/K/kraken-logo-6C9635516C-seeklogo.com.png",
  OKX: "https://seeklogo.com/images/O/okx-logo-BC669BA32F-seeklogo.com.png",
  Bitfinex: "https://seeklogo.com/images/B/bitfinex-logo-4E8BE6F1F3-seeklogo.com.png",
  Bybit: "https://seeklogo.com/images/B/bybit-logo-45C82EEC0E-seeklogo.com.png",
  KuCoin: "https://cryptologos.cc/logos/kucoin-shares-kcs-logo.png",
  Bitget: "https://seeklogo.com/images/B/bitget-logo-4B7C23B24F-seeklogo.com.png",
  HTX: "https://seeklogo.com/images/H/htx-logo-9C35447BE5-seeklogo.com.png",
  Backpack: "https://pbs.twimg.com/profile_images/1582831413929181185/rPBn_KPr_400x400.jpg",
  Jupiter: "https://pbs.twimg.com/profile_images/1618311983888297985/RyDbay-p_400x400.jpg",
  Raydium: "https://pbs.twimg.com/profile_images/1792895635089264640/FJB04_MY_400x400.jpg",
  Orca: "https://pbs.twimg.com/profile_images/1768306824946884608/uHXMDQcZ_400x400.jpg"
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
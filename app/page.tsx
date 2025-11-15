"use client";
import { useEffect , useState} from "react";

interface PriceUpdate{
  source : string;
  pair : string;
  price : number;
}

export default function Home() {

  const [binanceprice , setbinancePrice] = useState<number | null>(null);
  const [raydiumprice , setraydiumPrice] = useState<number | null>(null);
  const [jupiterprice , setjupiterPrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8081/ws");

    ws.onmessage = (event) => {
      const data : PriceUpdate = JSON.parse(event.data);
      
      if(data.source === "Binance") {
        setbinancePrice(data.price);
      }

      if(data.source === "Jupiter") {
        setjupiterPrice(data.price);
      }

      if(data.source === "Raydium") {
        setraydiumPrice(data.price);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold">Binance SOL/USDT</h2>
      <p className="text-2xl font-bold text-green-600">
        {binanceprice ? `$${binanceprice.toFixed(2)}` : "Loading..."}
      </p>

      <h2 className="text-xl font-semibold">Jupiter SOL/USDT</h2>
      <p className="text-2xl font-bold text-green-600">
        {jupiterprice ? `$${jupiterprice.toFixed(2)}` : "Loading..."}
      </p>

      <h2 className="text-xl font-semibold">Raydium SOL/USDT</h2>
      <p className="text-2xl font-bold text-green-600">
        {raydiumprice ? `$${raydiumprice.toFixed(2)}` : "Loading..."}
      </p>

    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pair = req.nextUrl.searchParams.get("pair");
  const source = req.nextUrl.searchParams.get("source");

  if (!pair || !source) {
    return NextResponse.json({ error: "Missing pair or source" }, { status: 400 });
  }

  // Generate mock historical data (30 1-minute candles)
  const now = Date.now();
  const candles = Array.from({ length: 30 }).map((_, i) => {
    const timestamp = new Date(now - (30 - i) * 60 * 1000); // 1-minute intervals
    const basePrice = pair.startsWith("SOL/USDT") ? 140 : 141;
    const price = basePrice + Math.random() * 2; // random price for demo
    return {
      timestamp: timestamp.toISOString(),
      price,
    };
  });

  return NextResponse.json(candles);
}

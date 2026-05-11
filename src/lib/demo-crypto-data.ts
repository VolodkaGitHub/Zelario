import { demoMarketCoins } from "@/mock/data/fixtures";
import type { CryptoData, ChartDataPoint } from "@/services/market/binance-api";

export function getDemoCryptoList(): CryptoData[] {
  return demoMarketCoins.map((coin) => {
    const pct = coin.price_change_percentage_24h ?? 0;
    const price = coin.current_price ?? 0;
    const changeVal = (price * pct) / 100;
    return {
      symbol: `${coin.symbol}USDT`,
      name: coin.name,
      price: price.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      change: changeVal.toFixed(2),
      changePercent: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
      volume: "1.2B",
      marketCap: coin.market_cap
        ? `${(coin.market_cap / 1e9).toFixed(1)}B`
        : "—",
      isPositive: pct >= 0,
    };
  });
}

export function getDemoChartHistory(
  symbol: string,
  limit = 48
): ChartDataPoint[] {
  const base =
    demoMarketCoins.find(
      (c) => `${c.symbol}USDT` === symbol || c.symbol === symbol
    )?.current_price ?? 1000;
  const now = Date.now();
  const points: ChartDataPoint[] = [];
  let price = base * 0.95;

  for (let i = limit; i >= 0; i--) {
    price *= 1 + (Math.random() - 0.48) * 0.02;
    const ts = now - i * 3600_000;
    points.push({
      timestamp: ts,
      date: new Date(ts).toISOString(),
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1_000_000),
    });
  }
  return points;
}

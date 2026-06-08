"use client";

import { memo, useEffect, useRef } from "react";

/** ภาพรวมตลาด (ดัชนี/ฟิวเจอร์ส/พันธบัตร/ฟอเร็กซ์) พร้อมมินิชาร์ต — TradingView */
function MarketOverview() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.querySelector("script")) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      locale: "th_TH",
      isTransparent: true,
      showFloatingTooltip: false,
      plotLineColorGrowing: "rgba(154, 121, 24, 1)",
      plotLineColorFalling: "rgba(200, 30, 30, 1)",
      gridLineColor: "rgba(255, 255, 255, 0)",
      scaleFontColor: "#DBDBDB",
      belowLineFillColorGrowing: "rgba(154, 121, 24, 0.12)",
      belowLineFillColorFalling: "rgba(200, 30, 30, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(154, 121, 24, 0)",
      belowLineFillColorFallingBottom: "rgba(200, 30, 30, 0)",
      symbolActiveColor: "rgba(154, 121, 24, 0.12)",
      tabs: [
        {
          title: "ดัชนี",
          symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "US 100" },
            { s: "FOREXCOM:DJI", d: "Dow Jones" },
            { s: "INDEX:NKY", d: "Nikkei 225" },
            { s: "INDEX:DEU40", d: "DAX" },
            { s: "FOREXCOM:UKXGBP", d: "FTSE 100" },
          ],
        },
        {
          title: "สินค้าโภคภัณฑ์",
          symbols: [
            { s: "CMCMARKETS:GOLD", d: "ทองคำ" },
            { s: "PYTH:WTI3!", d: "น้ำมัน WTI" },
            { s: "BMFBOVESPA:ISP1!", d: "S&P 500 Futures" },
            { s: "BMFBOVESPA:CCM1!", d: "ข้าวโพด" },
          ],
        },
        {
          title: "ฟอเร็กซ์",
          symbols: [
            { s: "FX:EURUSD", d: "EUR/USD" },
            { s: "FX:GBPUSD", d: "GBP/USD" },
            { s: "FX:USDJPY", d: "USD/JPY" },
            { s: "FX:USDCHF", d: "USD/CHF" },
            { s: "FX:AUDUSD", d: "AUD/USD" },
            { s: "FX:USDCAD", d: "USD/CAD" },
          ],
        },
      ],
      support_host: "https://www.tradingview.com",
      backgroundColor: "#0f0f0f",
      width: "100%",
      height: 600,
      showSymbolLogo: true,
      showChart: true,
    });
    el.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={ref}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(MarketOverview);

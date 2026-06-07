"use client";

import { memo, useEffect, useRef } from "react";

/**
 * แถบราคาวิ่ง (ticker tape) แบบตลาดหุ้น — ค่าเงิน ทองคำ คริปโต ดัชนี เรียลไทม์
 * จาก TradingView (official embed)
 */
function MarketTicker() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.querySelector("script")) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FX_IDC:USDTHB", title: "USD/THB" },
        { proName: "OANDA:XAUUSD", title: "ทองคำ" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
        { proName: "FX:USDJPY", title: "USD/JPY" },
        { proName: "TVC:DXY", title: "ดัชนีดอลลาร์" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { proName: "NASDAQ:NDX", title: "Nasdaq 100" },
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "th_TH",
    });
    el.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={ref}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(MarketTicker);

"use client";

import { memo, useEffect, useRef } from "react";

/**
 * วิดเจ็ตอัตราแลกเปลี่ยนเรียลไทม์จาก TradingView (forex cross rates)
 * ปรับให้ responsive + โทนเข้ากับ UI (พื้นดำ #0b0b0c)
 */
function TradingViewForex() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el || el.querySelector("script")) return; // กันโหลดซ้ำตอน re-render/StrictMode

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      isTransparent: false,
      locale: "th_TH",
      currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY"],
      backgroundColor: "#0b0b0c",
      width: "100%",
      height: 420,
    });
    el.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget" />
      <div className="px-1 pt-1 text-[10px] text-ink-soft">
        <a
          href="https://www.tradingview.com/markets/currencies/"
          rel="noopener nofollow"
          target="_blank"
          className="hover:text-accent"
        >
          ข้อมูลตลาดโดย TradingView
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewForex);

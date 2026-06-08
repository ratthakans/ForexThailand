"use client";

import { memo, useEffect, useRef } from "react";

/** กราฟราคาแบบ Advanced Chart (ค่าเริ่มต้น: ทองคำ XAUUSD) เปลี่ยน symbol ได้ — TradingView */
function AdvancedChart() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.querySelector("script")) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "D",
      locale: "th_TH",
      save_image: true,
      style: "1",
      symbol: "OANDA:XAUUSD",
      theme: "dark",
      timezone: "Asia/Bangkok",
      backgroundColor: "#0F0F0F",
      gridColor: "rgba(242, 242, 242, 0.06)",
      withdateranges: false,
      autosize: true,
    });
    el.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={ref}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}

export default memo(AdvancedChart);

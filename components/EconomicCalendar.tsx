"use client";

import { memo, useEffect, useRef } from "react";

/**
 * ปฏิทินเศรษฐกิจโลก (เหตุการณ์ที่ขับเคลื่อนตลาด เช่น NFP, CPI, ดอกเบี้ย)
 * จาก TradingView (official embed) — ทำให้เว็บมีข้อมูลสด ๆ ทุกวัน
 */
function EconomicCalendar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.querySelector("script")) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      isTransparent: false,
      locale: "th_TH",
      countryFilter: "us,eu,jp,gb,th,cn,au,ca,ch,de",
      importanceFilter: "0,1",
      width: "100%",
      height: 540,
    });
    el.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={ref}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(EconomicCalendar);

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * เรนเดอร์ children เฉพาะตอนเลื่อนใกล้ถึง (IntersectionObserver)
 * ใช้ห่อวิดเจ็ตหนัก ๆ (TradingView ฯลฯ) เพื่อไม่ให้โหลดพร้อมกันทั้งหน้า
 */
export function LazyMount({
  children,
  minHeight = 420,
  rootMargin = "300px",
}: {
  children: React.ReactNode;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}

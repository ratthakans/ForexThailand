"use client";

import { useEffect, useRef, useState } from "react";

/**
 * วิดีโอถ่ายทอดสดเป็น "พื้นหลัง" ของ section — autoplay (มิวต์) เมื่อเลื่อนถึง
 * แสดงรูปปกก่อน แล้วค่อยสลับเป็นวิดีโอ (ประหยัดเน็ตตอนโหลดแรก)
 */
export function LiveBackground({ videoId }: { videoId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-black">
      {play ? (
        <iframe
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${videoId}`}
          title="ถ่ายทอดสดตลาดการเงิน"
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
      )}
    </div>
  );
}

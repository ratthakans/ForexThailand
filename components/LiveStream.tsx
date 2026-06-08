"use client";

import { useState } from "react";

/**
 * ถ่ายทอดสด — ใช้ "facade" (รูปปก + ปุ่มเล่น) ก่อน เมื่อคลิกค่อยโหลด iframe จริง
 * → ไม่โหลด/เล่นวิดีโออัตโนมัติ ทำให้หน้าเบาและประหยัดเน็ตของผู้อ่าน
 */
export function LiveStream({ videoId }: { videoId: string }) {
  const [play, setPlay] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-black shadow-sm">
      <div className="relative aspect-video">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`}
            title="ถ่ายทอดสด — Forex Thailand"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            aria-label="เล่นการถ่ายทอดสด"
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt="ถ่ายทอดสดตลาดการเงิน"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />
            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-breaking px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-black shadow-lg transition-transform group-hover:scale-110">
              ▶
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

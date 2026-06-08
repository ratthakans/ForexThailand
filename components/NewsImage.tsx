"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

/**
 * รูปข่าวด้วย next/image (unoptimized — รับรูปต่างโดเมนได้ทุกแหล่ง)
 * ถ้าไม่มี src หรือรูปพัง (เช่น 404) จะ "ไม่แสดงรูปทั้งบล็อก" (return null)
 * แทนที่จะโชว์ไอคอนรูปแตกหรือทำให้หน้าพัง — layout รอบ ๆ ยุบเรียบเอง
 *
 * รองรับ 2 กรณีของการ error:
 *  - error หลัง hydrate → onError
 *  - error "ก่อน" hydrate (SSR img โหลดพังไปก่อน React) → ref เช็ก naturalWidth=0
 */
export function NewsImage({
  src,
  alt,
  eager = false,
  ratioClassName = "aspect-[16/9]",
  sizes = "(max-width: 768px) 100vw, 768px",
  credit,
  className = "",
}: {
  src?: string | null;
  alt: string;
  eager?: boolean;
  ratioClassName?: string;
  sizes?: string;
  credit?: string | null;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  const checkBroken = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth === 0) {
      setBroken(true);
    }
  }, []);

  if (!src || broken) {
    // รูปหาย/พัง → placeholder แบรนด์ (แทนกล่องว่าง) ให้การ์ดดูสม่ำเสมอ
    return (
      <figure className={className}>
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#15151a] to-[#2a2a33] ${ratioClassName}`}
          aria-label={alt}
        >
          <div className="flex flex-col items-center gap-1 opacity-80">
            <span className="font-logo text-2xl font-bold text-[#cda33f]">FX</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Forex Thailand
            </span>
          </div>
        </div>
      </figure>
    );
  }

  return (
    <figure className={className}>
      <div
        className={`relative w-full overflow-hidden bg-surface ${ratioClassName}`}
      >
        <Image
          ref={checkBroken}
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes={sizes}
          priority={eager}
          onError={() => setBroken(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      {credit && (
        <figcaption className="mt-2 text-[11px] text-ink-soft">
          {credit}
        </figcaption>
      )}
    </figure>
  );
}

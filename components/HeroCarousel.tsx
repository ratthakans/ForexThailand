"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/format";
import { type CardArticle } from "@/components/ArticleCard";

/** ฮีโร่แบบสไลด์ภาพใหญ่ overlay ข้อความ (auto-rotate) สไตล์นิตยสารข่าว */
export function HeroCarousel({ items }: { items: CardArticle[] }) {
  const [i, setI] = useState(0);
  const n = items.length;
  const go = useCallback((idx: number) => setI(((idx % n) + n) % n), [n]);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {items.map((a, idx) => (
          <Link
            key={a.id}
            href={`/article/${a.id}`}
            className="group relative block aspect-[16/11] w-full shrink-0 sm:aspect-[16/7] lg:aspect-[21/9]"
          >
            {a.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.image_url}
                alt={a.title_th}
                loading={idx === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e6c25a]">
                {categoryLabel(a.category)}
              </span>
              <h2 className="mt-2 max-w-3xl font-display text-2xl font-bold leading-tight text-white drop-shadow-sm sm:text-3xl lg:text-[2.7rem] lg:leading-[1.08]">
                {a.title_th}
              </h2>
              <p className="mt-2 hidden max-w-2xl text-sm leading-relaxed text-white/80 sm:line-clamp-2 sm:block">
                {a.excerpt}
              </p>
              <time className="mt-3 block text-[11px] uppercase tracking-wide text-white/55">
                {a.dateLabel}
              </time>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="ก่อนหน้า"
        onClick={() => go(i - 1)}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="ถัดไป"
        onClick={() => go(i + 1)}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        ›
      </button>

      <div className="absolute bottom-5 right-5 z-10 flex gap-2 sm:bottom-8 sm:right-8">
        {items.map((a, d) => (
          <button
            key={a.id}
            type="button"
            aria-label={`สไลด์ ${d + 1}`}
            onClick={() => go(d)}
            className={`h-2 rounded-full transition-all ${
              d === i ? "bg-gold w-7" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BrokerLogo } from "@/components/BrokerLogo";

export type PromoSlide = {
  slug: string;
  name: string;
  domain: string;
  rating: number;
  badge: string;
  title: string;
  desc: string;
};

function Slide({ s }: { s: PromoSlide }) {
  return (
    <Link
      href={`/brokers/${s.slug}`}
      className="group grid w-full shrink-0 grid-cols-1 items-center gap-7 bg-white p-7 sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-10 md:min-h-[300px]"
    >
      {/* แผงโลโก้โบรกเกอร์ */}
      <div className="flex items-center justify-center rounded-2xl bg-surface p-6">
        <BrokerLogo domain={s.domain} name={s.name} size={120} />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-gold rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
            {s.badge}
          </span>
          <span className="text-sm tracking-wide text-accent">
            {"★".repeat(s.rating)}
            <span className="text-[#d8d4c4]">{"★".repeat(5 - s.rating)}</span>
          </span>
        </div>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-accent">
          {s.name}
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold leading-snug tracking-tight text-ink sm:text-[2rem] sm:leading-[1.15]">
          {s.title}
        </h3>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          {s.desc}
        </p>
        <span className="bg-gold mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold text-black transition-transform group-hover:translate-x-1">
          ดูรีวิว {s.name} →
        </span>
      </div>
    </Link>
  );
}

export function PromoCarousel({ slides }: { slides: PromoSlide[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = useCallback((idx: number) => setI(((idx % n) + n) % n), [n]);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line shadow-sm">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {slides.map((s) => (
          <Slide key={s.slug} s={s} />
        ))}
      </div>

      <button
        type="button"
        aria-label="ก่อนหน้า"
        onClick={() => go(i - 1)}
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/5 text-lg text-ink transition-colors hover:bg-ink/10"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="ถัดไป"
        onClick={() => go(i + 1)}
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/5 text-lg text-ink transition-colors hover:bg-ink/10"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((s, d) => (
          <button
            key={s.slug}
            type="button"
            aria-label={`หน้า ${d + 1}`}
            onClick={() => go(d)}
            className={`h-2 rounded-full transition-all ${
              d === i ? "bg-gold w-7" : "w-2 bg-ink/15 hover:bg-ink/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import { ArticleCard, type CardArticle } from "@/components/ArticleCard";

export type Tab = { slug: string; label: string; keywords: string[] };

/** แถวข่าวเลื่อนแนวนอน (snap) + แท็บกรองหมวด — ประหยัดพื้นที่แนวตั้ง */
export function NewsSlider({
  articles,
  tabs,
}: {
  articles: CardArticle[];
  tabs: Tab[];
}) {
  const [active, setActive] = useState("all");
  const scroller = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (active === "all") return articles;
    const t = tabs.find((x) => x.slug === active);
    if (!t) return articles;
    const kws = t.keywords.map((k) => k.toLowerCase());
    return articles.filter((a) => {
      const hay = `${a.title_th} ${a.excerpt}`.toLowerCase();
      return kws.some((k) => hay.includes(k));
    });
  }, [active, articles, tabs]);

  const nudge = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            active === "all"
              ? "bg-ink text-white"
              : "border border-line text-ink-soft hover:border-ink/30 hover:text-ink"
          }`}
        >
          ทั้งหมด
        </button>
        {tabs.map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => setActive(t.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              active === t.slug
                ? "bg-ink text-white"
                : "border border-line text-ink-soft hover:border-ink/30 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}

        <div className="ml-auto hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="เลื่อนซ้าย"
            onClick={() => nudge(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="เลื่อนขวา"
            onClick={() => nudge(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
          >
            ›
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-14 text-center text-sm text-ink-soft">
          ยังไม่มีข่าวในหมวดนี้
        </p>
      ) : (
        <div
          ref={scroller}
          className="grid snap-x auto-cols-[280px] grid-flow-col grid-rows-2 gap-5 overflow-x-auto pb-2 sm:auto-cols-[320px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filtered.map((a) => (
            <div key={a.id} className="snap-start">
              <ArticleCard a={a} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ArticleCard, type CardArticle } from "@/components/ArticleCard";

export type Tab = { slug: string; label: string; keywords: string[] };

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-ink text-white"
          : "border border-line text-ink-soft hover:border-ink/30 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

/** กริดข่าว + แท็บกรองหมวด (กรองฝั่ง client จากคีย์เวิร์ด) */
export function NewsExplorer({
  articles,
  tabs,
}: {
  articles: CardArticle[];
  tabs: Tab[];
}) {
  const [active, setActive] = useState("all");

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

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <TabButton
          label="ทั้งหมด"
          active={active === "all"}
          onClick={() => setActive("all")}
        />
        {tabs.map((t) => (
          <TabButton
            key={t.slug}
            label={t.label}
            active={active === t.slug}
            onClick={() => setActive(t.slug)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-14 text-center text-sm text-ink-soft">
          ยังไม่มีข่าวในหมวดนี้
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}

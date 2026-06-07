"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewsImage } from "@/components/NewsImage";
import { categoryLabel } from "@/lib/format";

/** ข้อมูลข่าวที่ serialize แล้วจาก server component (Date → string) */
export type PendingArticle = {
  id: number;
  source_url: string | null;
  title_th: string;
  body_th: string;
  image_url: string | null;
  image_credit: string | null;
  category: string;
  created_at: string; // ISO string + แสดงผลไทยจาก server แล้ว
  created_at_label: string;
};

type Action = "approve" | "reject";

function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    breaking: "bg-breaking/10 text-breaking",
    image: "bg-accent/10 text-accent",
  };
  return (
    <span
      className={`rounded-sm px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] ${
        styles[category] ?? "bg-ink/5 text-ink-soft"
      }`}
    >
      {categoryLabel(category)}
    </span>
  );
}

function PendingItem({
  article,
  onDone,
}: {
  article: PendingArticle;
  onDone: (id: number) => void;
}) {
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  async function review(action: Action) {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, action }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        webhook?: string;
      } | null;

      if (res.ok && data?.ok) {
        if (action === "approve" && data.webhook === "failed") {
          // อนุมัติแล้วแต่ webhook พัง — แจ้งไว้ก่อนรายการหาย
          alert(
            `ข่าว #${article.id} อนุมัติแล้ว แต่ยิง n8n ไม่สำเร็จ — ไปสั่งโพสซ้ำใน n8n เองได้`
          );
        }
        onDone(article.id);
      } else if (res.status === 404) {
        // ถูกรีวิวจากแท็บอื่นไปแล้ว — เอาออกจากจอเช่นกัน
        onDone(article.id);
      } else {
        setError(data?.error ?? `เกิดข้อผิดพลาด (${res.status})`);
        setBusy(null);
      }
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง");
      setBusy(null);
    }
  }

  const longBody = article.body_th.length > 280;

  return (
    <li className="border border-line bg-white">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <NewsImage
          src={article.image_url}
          alt={article.title_th}
          ratioClassName="aspect-[16/10] sm:aspect-square"
          sizes="160px"
          className="w-full sm:w-40 sm:shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={article.category} />
            <span className="text-[11px] text-ink-soft">
              #{article.id} · {article.created_at_label}
            </span>
          </div>

          <h2 className="mt-2 font-serif text-lg font-bold leading-snug text-ink">
            {article.title_th}
          </h2>

          <p
            className={`mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft ${
              expanded ? "" : "line-clamp-4"
            }`}
          >
            {article.body_th}
          </p>
          {longBody && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-semibold text-accent hover:underline"
            >
              {expanded ? "ย่อเนื้อหา" : "อ่านเนื้อหาเต็ม"}
            </button>
          )}

          {article.image_credit && (
            <p className="mt-2 text-[11px] text-ink-soft">
              เครดิตรูป: {article.image_credit}
            </p>
          )}
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-xs text-accent underline underline-offset-2 hover:no-underline"
            >
              {article.source_url}
            </a>
          )}

          {error && (
            <p className="mt-3 text-sm font-medium text-breaking">{error}</p>
          )}

          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => review("approve")}
              className="rounded-sm bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === "approve" ? "กำลังอนุมัติ…" : "✓ อนุมัติ"}
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => review("reject")}
              className="rounded-sm border border-breaking/40 px-4 py-2 text-sm font-semibold text-breaking transition-colors hover:bg-breaking/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === "reject" ? "กำลังปฏิเสธ…" : "✕ ปฏิเสธ"}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function AdminReviewList({ initial }: { initial: PendingArticle[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  function handleDone(id: number) {
    // ลบออกจากจอทันที แล้ว refresh ข้อมูลฝั่ง server เผื่อมีข่าวใหม่เข้ามา
    setItems((prev) => prev.filter((a) => a.id !== id));
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-line py-16 text-center">
        <p className="font-serif text-lg font-bold text-ink">
          ไม่มีข่าวรอรีวิว 🎉
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          ข่าวใหม่จาก n8n จะโผล่ที่นี่เมื่อสถานะเป็น pending_review
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((a) => (
        <PendingItem key={a.id} article={a} onDone={handleDone} />
      ))}
    </ul>
  );
}

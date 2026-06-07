"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewsImage } from "@/components/NewsImage";
import { categoryLabel } from "@/lib/format";

export type AdminArticle = {
  id: number;
  title_th: string;
  category: string;
  status: string;
  image_url: string | null;
  created_at_label: string;
};

function StatusBadge({ status }: { status: string }) {
  const hidden = status === "rejected";
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        hidden ? "bg-ink/10 text-ink-soft" : "bg-accent/10 text-accent"
      }`}
    >
      {hidden ? "ซ่อนอยู่" : "เผยแพร่"}
    </span>
  );
}

function Row({
  a,
  onToggled,
}: {
  a: AdminArticle;
  onToggled: (id: number, status: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const hidden = a.status === "rejected";

  async function toggle() {
    setBusy(true);
    const next = hidden ? "approved" : "rejected";
    try {
      const res = await fetch("/api/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, statusOnly: true, status: next }),
      });
      if (res.ok) {
        onToggled(a.id, next);
      } else {
        const d = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        alert(d?.error ?? "อัปเดตไม่สำเร็จ");
      }
    } catch {
      alert("เชื่อมต่อไม่สำเร็จ");
    }
    setBusy(false);
  }

  return (
    <li className="flex gap-4 border border-line bg-white p-3 sm:p-4">
      <div className="w-24 shrink-0 sm:w-28">
        <NewsImage
          src={a.image_url}
          alt={a.title_th}
          ratioClassName="aspect-[4/3]"
          sizes="112px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-accent">
            {categoryLabel(a.category)}
          </span>
          <StatusBadge status={a.status} />
          <span className="text-[11px] text-ink-soft">
            #{a.id} · {a.created_at_label}
          </span>
        </div>
        <h2 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug text-ink">
          {a.title_th}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/admin/${a.id}`}
            className="rounded bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            แก้ไข
          </Link>
          <a
            href={`/article/${a.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink"
          >
            ดูหน้าเว็บ ↗
          </a>
          <button
            type="button"
            onClick={toggle}
            disabled={busy}
            className={`rounded px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
              hidden
                ? "border border-accent text-accent hover:bg-accent/5"
                : "border border-breaking/40 text-breaking hover:bg-breaking/5"
            }`}
          >
            {busy ? "…" : hidden ? "แสดง" : "ซ่อน"}
          </button>
        </div>
      </div>
    </li>
  );
}

export function AdminManager({ initial }: { initial: AdminArticle[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  function onToggled(id: number, status: string) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-line py-16 text-center">
        <p className="font-display text-lg font-bold text-ink">ยังไม่มีบทความ</p>
        <p className="mt-1 text-sm text-ink-soft">
          บทความใหม่จาก n8n จะปรากฏที่นี่และขึ้นเว็บทันที
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((a) => (
        <Row key={a.id} a={a} onToggled={onToggled} />
      ))}
    </ul>
  );
}

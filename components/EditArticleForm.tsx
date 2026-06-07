"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type EditableArticle = {
  id: number;
  title_th: string;
  hook: string;
  body_th: string;
  image_url: string;
  image_credit: string;
  category: string;
  author: string;
  status: string;
};

const CATEGORIES = ["general", "breaking", "image", "news_update"];
const STATUS_OPTIONS: [string, string][] = [
  ["approved", "เผยแพร่ (อนุมัติ)"],
  ["pending_review", "รอตรวจ (ยังขึ้นเว็บ)"],
  ["posted", "โพสต์ FB แล้ว"],
  ["rejected", "ซ่อน (ไม่ขึ้นเว็บ)"],
];

const inputCls =
  "w-full rounded border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink">
        {label}
        {hint && <span className="ml-2 font-normal text-ink-soft">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function EditArticleForm({ article }: { article: EditableArticle }) {
  const router = useRouter();
  const [f, setF] = useState<EditableArticle>(article);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  function up<K extends keyof EditableArticle>(k: K, v: EditableArticle[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title_th.trim()) {
      setMsg({ type: "err", text: "หัวข้อห้ามว่าง" });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const d = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (res.ok && d?.ok) {
        setMsg({ type: "ok", text: "บันทึกแล้ว ✓" });
        router.refresh();
      } else {
        setMsg({ type: "err", text: d?.error ?? `ผิดพลาด (${res.status})` });
      }
    } catch {
      setMsg({ type: "err", text: "เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง" });
    }
    setBusy(false);
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <Field label="หัวข้อข่าว (title_th)">
        <input
          className={inputCls}
          value={f.title_th}
          onChange={(e) => up("title_th", e.target.value)}
        />
      </Field>

      <Field label="คำโปรย (hook)" hint="ใช้เป็น og:description ตอนแชร์">
        <input
          className={inputCls}
          value={f.hook}
          onChange={(e) => up("hook", e.target.value)}
          placeholder="สรุปข่าว 1 ประโยค"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="หมวด (category)">
          <select
            className={inputCls}
            value={f.category}
            onChange={(e) => up("category", e.target.value)}
          >
            {[...new Set([f.category, ...CATEGORIES])].filter(Boolean).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ผู้เขียน (author)">
          <input
            className={inputCls}
            value={f.author}
            onChange={(e) => up("author", e.target.value)}
          />
        </Field>
      </div>

      <Field label="ลิงก์รูป (image_url)" hint="ว่าง = ใช้ภาพแบรนด์ default">
        <input
          className={inputCls}
          value={f.image_url}
          onChange={(e) => up("image_url", e.target.value)}
          placeholder="https://images.pexels.com/..."
        />
      </Field>

      <Field label="เครดิตรูป (image_credit)">
        <input
          className={inputCls}
          value={f.image_credit}
          onChange={(e) => up("image_credit", e.target.value)}
        />
      </Field>

      <Field label="เนื้อหา (body_th)">
        <textarea
          className={`${inputCls} min-h-[260px] leading-relaxed`}
          value={f.body_th}
          onChange={(e) => up("body_th", e.target.value)}
        />
      </Field>

      <Field label="สถานะ (status)">
        <select
          className={inputCls}
          value={f.status}
          onChange={(e) => up("status", e.target.value)}
        >
          {STATUS_OPTIONS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </Field>

      {msg && (
        <p
          className={`text-sm font-medium ${
            msg.type === "ok" ? "text-accent" : "text-breaking"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={busy}
          className="rounded bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "กำลังบันทึก…" : "บันทึกการแก้ไข"}
        </button>
        <Link
          href="/admin"
          className="text-sm font-semibold text-ink-soft hover:text-ink"
        >
          ← กลับ
        </Link>
        <a
          href={`/article/${f.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm font-semibold text-accent hover:underline"
        >
          ดูหน้าเว็บ ↗
        </a>
      </div>
    </form>
  );
}

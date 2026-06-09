"use client";

import { useState } from "react";

const INTERESTS = [
  "เป็นพาร์ทเนอร์ / ความร่วมมือ",
  "ลงโฆษณา / สปอนเซอร์",
  "แนะนำ / รีวิวโบรกเกอร์",
  "ประชาสัมพันธ์ข่าว",
  "อื่น ๆ",
];

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function PartnerForm() {
  const [f, setF] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    interest: INTERESTS[0],
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function up<K extends keyof typeof f>(k: K, v: string) {
    setF((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 8) {
      setError("กรุณากรอกชื่อ และเบอร์โทรให้ถูกต้อง");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const d = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (res.ok && d?.ok) {
        setDone(true);
      } else {
        setError(d?.error ?? `เกิดข้อผิดพลาด (${res.status})`);
      }
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-accent/40 bg-surface p-6 text-center">
        <p className="font-display text-lg font-bold text-ink">
          ได้รับข้อมูลแล้ว ✓
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          ขอบคุณที่สนใจร่วมงานกับ Forex Thailand
          ทีมงานของเราจะติดต่อกลับทางโทรศัพท์โดยเร็วที่สุด
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink">
            ชื่อผู้ติดต่อ *
          </span>
          <input
            className={inputCls}
            value={f.name}
            onChange={(e) => up("name", e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink">
            บริษัท / แบรนด์
          </span>
          <input
            className={inputCls}
            value={f.company}
            onChange={(e) => up("company", e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink">
            เบอร์โทร * <span className="font-normal text-ink-soft">(ทีมขายจะโทรกลับ)</span>
          </span>
          <input
            type="tel"
            className={inputCls}
            value={f.phone}
            onChange={(e) => up("phone", e.target.value)}
            placeholder="08x-xxx-xxxx"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink">อีเมล</span>
          <input
            type="email"
            className={inputCls}
            value={f.email}
            onChange={(e) => up("email", e.target.value)}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-ink">
          ความสนใจ
        </span>
        <select
          className={inputCls}
          value={f.interest}
          onChange={(e) => up("interest", e.target.value)}
        >
          {INTERESTS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-ink">
          รายละเอียดเพิ่มเติม
        </span>
        <textarea
          className={`${inputCls} min-h-[120px] leading-relaxed`}
          value={f.message}
          onChange={(e) => up("message", e.target.value)}
          placeholder="บอกเราเกี่ยวกับความร่วมมือที่คุณสนใจ"
        />
      </label>

      {error && <p className="text-sm font-medium text-breaking">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="bg-gold w-full rounded-lg px-5 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {busy ? "กำลังส่ง…" : "ส่งข้อมูล ให้ทีมขายติดต่อกลับ"}
      </button>
      <p className="text-[11px] text-ink-soft">
        เราจะใช้ข้อมูลของคุณเพื่อติดต่อกลับเรื่องความร่วมมือเท่านั้น
      </p>
    </form>
  );
}

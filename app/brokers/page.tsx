import type { Metadata } from "next";
import { BROKERS, type Broker } from "@/lib/brokers";

export const metadata: Metadata = {
  title: "รีวิวโบรกเกอร์ Forex 50 อันดับ ปี 2025",
  description:
    "เปรียบเทียบและรีวิวโบรกเกอร์ Forex 50 อันดับ — เลเวอเรจ เงินฝากขั้นต่ำ การกำกับดูแล ข้อดี-ข้อเสีย คัดมาให้ครบในที่เดียว",
  alternates: { canonical: "/brokers" },
  openGraph: {
    type: "website",
    url: "/brokers",
    siteName: "Forex Thailand",
    locale: "th_TH",
    title: "รีวิวโบรกเกอร์ Forex 50 อันดับ ปี 2025 — Forex Thailand",
    description:
      "เปรียบเทียบโบรกเกอร์ Forex 50 อันดับ เลเวอเรจ เงินฝากขั้นต่ำ การกำกับดูแล ข้อดี-ข้อเสีย",
    images: [{ url: "/og-default", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default"] },
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm leading-none tracking-wide" aria-label={`${rating}/5`}>
      <span className="text-accent">{"★".repeat(rating)}</span>
      <span className="text-[#d4d4d4]">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function Rank({ n }: { n: number }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
      {n}
    </span>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </dt>
      <dd className="truncate text-[13px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

function FeatureCard({ b }: { b: Broker }) {
  return (
    <article className="flex flex-col rounded-lg border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Rank n={b.rank} />
          <div>
            <h3 className="font-display text-lg font-bold leading-tight text-ink">
              {b.name}
            </h3>
            <Stars rating={b.rating} />
          </div>
        </div>
        {b.rank <= 3 && (
          <span className="rounded bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-ink">
            แนะนำ
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{b.highlight}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4">
        <Spec label="เลเวอเรจ" value={b.leverage} />
        <Spec label="ฝากขั้นต่ำ" value={b.minDeposit} />
        <Spec label="กำกับดูแล" value={b.regulation} />
        <Spec label="ประเภท" value={b.type} />
      </dl>

      <div className="mt-4 grid gap-3 text-[13px] sm:grid-cols-2">
        <ul className="space-y-1">
          {b.pros.map((p) => (
            <li key={p} className="flex gap-1.5 text-ink">
              <span className="text-accent">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <ul className="space-y-1">
          {b.cons.map((c) => (
            <li key={c} className="flex gap-1.5 text-ink-soft">
              <span>–</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ListRow({ b }: { b: Broker }) {
  return (
    <article className="flex gap-4 border-b border-line py-4 last:border-b-0">
      <Rank n={b.rank} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-base font-bold leading-tight text-ink">
            {b.name}
          </h3>
          <Stars rating={b.rating} />
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          {b.highlight}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-soft">
          <span>
            เลเวอเรจ <strong className="text-ink">{b.leverage}</strong>
          </span>
          <span>
            ฝากขั้นต่ำ <strong className="text-ink">{b.minDeposit}</strong>
          </span>
          <span>
            กำกับ <strong className="text-ink">{b.regulation}</strong>
          </span>
        </div>
      </div>
    </article>
  );
}

export default function BrokersPage() {
  const top = BROKERS.slice(0, 10);
  const rest = BROKERS.slice(10);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-10">
      {/* header */}
      <header className="border-b-2 border-ink pb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
          รีวิวโบรกเกอร์
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
          รีวิวโบรกเกอร์ Forex 50 อันดับ
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          เปรียบเทียบโบรกเกอร์ฟอเร็กซ์ยอดนิยม คัดมา 50 อันดับ พร้อมเลเวอเรจ
          เงินฝากขั้นต่ำ การกำกับดูแล และข้อดี-ข้อเสีย เพื่อช่วยให้เลือกได้ตรงกับสไตล์การเทรด
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-wide text-ink-soft">
          อัปเดตล่าสุด · มิถุนายน 2569
        </p>
      </header>

      {/* disclaimer */}
      <aside className="mt-6 rounded-lg border-l-4 border-accent bg-surface px-4 py-3 text-[13px] leading-relaxed text-ink">
        <strong>โปรดอ่าน:</strong> ข้อมูลเป็นการรวบรวมเพื่อเปรียบเทียบเบื้องต้น
        อาจมีการเปลี่ยนแปลง โปรดตรวจสอบเงื่อนไขกับโบรกเกอร์โดยตรงก่อนตัดสินใจ ·
        การเทรด Forex มีความเสี่ยงสูง อาจสูญเสียเงินลงทุนทั้งหมด — ไม่ใช่คำแนะนำการลงทุน
      </aside>

      {/* top 10 */}
      <section className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-4 w-1.5 bg-accent" aria-hidden />
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            10 อันดับแนะนำ
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {top.map((b) => (
            <FeatureCard key={b.slug} b={b} />
          ))}
        </div>
      </section>

      {/* 11–50 */}
      <section className="mt-12">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-4 w-1.5 bg-accent" aria-hidden />
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            โบรกเกอร์ทั้งหมด · อันดับ 11–50
          </h2>
        </div>
        <div className="rounded-lg border border-line bg-white px-5">
          {rest.map((b) => (
            <ListRow key={b.slug} b={b} />
          ))}
        </div>
      </section>
    </div>
  );
}

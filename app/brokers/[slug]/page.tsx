import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BROKERS,
  getBroker,
  brokerScores,
  type Broker,
} from "@/lib/brokers";
import { BrokerLogo } from "@/components/BrokerLogo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BROKERS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const b = getBroker(slug);
  if (!b) return { title: "ไม่พบโบรกเกอร์" };
  const s = brokerScores(b);
  const description = `รีวิว ${b.name} — คะแนน ${s.overall.toFixed(1)}/10 · เลเวอเรจ ${b.leverage} · เงินฝากขั้นต่ำ ${b.minDeposit} · กำกับดูแล ${b.regulation}. ${b.highlight}`;
  return {
    title: `รีวิว ${b.name} — คะแนน ${s.overall.toFixed(1)}/10`,
    description,
    alternates: { canonical: `/brokers/${b.slug}` },
    openGraph: {
      type: "article",
      url: `/brokers/${b.slug}`,
      siteName: "Forex Thailand",
      locale: "th_TH",
      title: `รีวิว ${b.name} โบรกเกอร์ Forex`,
      description,
      images: [{ url: "/og-default", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: ["/og-default"] },
  };
}

function scoreLabel(v: number): string {
  if (v >= 8.5) return "ดีเยี่ยม";
  if (v >= 7) return "ดีมาก";
  if (v >= 5.5) return "ดี";
  if (v >= 4) return "ปานกลาง";
  return "ควรพิจารณา";
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-ink-soft">{label}</span>
        <span className="font-display font-bold text-ink">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
        <div
          className="bg-gold h-full rounded-full"
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-3 last:border-b-0">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="text-right text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

export default async function BrokerDetail({ params }: PageProps) {
  const { slug } = await params;
  const b: Broker | undefined = getBroker(slug);
  if (!b) notFound();
  const s = brokerScores(b);

  return (
    <div>
      {/* HERO (dark) */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-5 py-8 md:py-10">
          <nav className="text-[11px] uppercase tracking-[0.14em] text-white/50">
            <Link href="/brokers" className="hover:text-white">
              รีวิวโบรกเกอร์
            </Link>
            <span className="mx-2">›</span>
            <span className="text-accent">{b.name}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <BrokerLogo domain={b.domain} name={b.name} size={64} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/80">
                    อันดับ #{b.rank}
                  </span>
                  <span className="text-sm tracking-wide text-accent">
                    {"★".repeat(b.rating)}
                    <span className="text-white/25">
                      {"★".repeat(5 - b.rating)}
                    </span>
                  </span>
                </div>
                <h1 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">
                  {b.name}
                </h1>
                <p className="mt-1 text-sm text-white/60">{b.regulation}</p>
              </div>
            </div>

            {/* score */}
            <div className="flex shrink-0 items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wide text-white/50">
                  คะแนนรวม
                </p>
                <p className="font-display text-base font-semibold text-accent">
                  {scoreLabel(s.overall)}
                </p>
              </div>
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06]">
                <span className="font-display text-3xl font-bold text-white">
                  {s.overall.toFixed(1)}
                </span>
                <span className="text-[10px] text-white/45">/ 10</span>
              </div>
            </div>
          </div>

          <a
            href={`https://${b.domain}`}
            target="_blank"
            rel="noopener nofollow"
            className="bg-gold mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            เยี่ยมชมเว็บไซต์ {b.name} ↗
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* score breakdown */}
          <section>
            <h2 className="mb-4 font-display text-lg font-bold text-ink">
              คะแนนแยกตามด้าน
            </h2>
            <div className="space-y-4 rounded-xl border border-line bg-white p-5">
              <Bar label="ดัชนีใบอนุญาต" value={s.license} />
              <Bar label="ดัชนีธุรกิจ" value={s.business} />
              <Bar label="การจัดการความเสี่ยง" value={s.risk} />
              <Bar label="ซอฟต์แวร์ / แพลตฟอร์ม" value={s.software} />
              <Bar label="การกำกับดูแล" value={s.regulation} />
            </div>
          </section>

          {/* info */}
          <section>
            <h2 className="mb-4 font-display text-lg font-bold text-ink">
              ข้อมูลโบรกเกอร์
            </h2>
            <dl className="rounded-xl border border-line bg-white px-5">
              <InfoRow label="อันดับ" value={`#${b.rank} จาก 50`} />
              <InfoRow label="คะแนนรีวิว" value={`${s.overall.toFixed(1)} / 10`} />
              <InfoRow label="เลเวอเรจสูงสุด" value={b.leverage} />
              <InfoRow label="เงินฝากขั้นต่ำ" value={b.minDeposit} />
              <InfoRow label="ประเภท" value={b.type} />
              <InfoRow label="การกำกับดูแล" value={b.regulation} />
              <InfoRow label="เว็บไซต์" value={b.domain} />
            </dl>
          </section>
        </div>

        {/* review summary */}
        <section className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-ink">
            รีวิวโดยสรุป
          </h2>
          <p className="text-[15px] leading-relaxed text-ink">
            {b.name} เป็นโบรกเกอร์ที่ได้คะแนนรวม{" "}
            <strong className="text-accent">{s.overall.toFixed(1)}/10</strong> (
            {scoreLabel(s.overall)}) จากการประเมินของ Forex Thailand — {b.highlight}{" "}
            เหมาะกับเทรดเดอร์ที่มองหาเลเวอเรจ {b.leverage} และเงินฝากขั้นต่ำ{" "}
            {b.minDeposit} ภายใต้การกำกับดูแลของ {b.regulation}
          </p>
        </section>

        {/* pros / cons */}
        {(b.pros.length > 0 || b.cons.length > 0) && (
          <section className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-5">
              <h3 className="mb-3 font-display text-base font-bold text-ink">
                ข้อดี
              </h3>
              <ul className="space-y-2 text-sm text-ink">
                {b.pros.length > 0 ? (
                  b.pros.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-accent">✓</span>
                      <span>{p}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-ink-soft">{b.highlight}</li>
                )}
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-white p-5">
              <h3 className="mb-3 font-display text-base font-bold text-ink">
                ข้อสังเกต
              </h3>
              <ul className="space-y-2 text-sm text-ink-soft">
                {b.cons.length > 0 ? (
                  b.cons.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span>–</span>
                      <span>{c}</span>
                    </li>
                  ))
                ) : (
                  <li>โปรดตรวจสอบเงื่อนไขและค่าธรรมเนียมกับโบรกเกอร์โดยตรง</li>
                )}
              </ul>
            </div>
          </section>
        )}

        {/* disclaimer */}
        <aside className="mt-8 rounded-lg border-l-4 border-accent bg-surface px-4 py-3 text-[13px] leading-relaxed text-ink-soft">
          คะแนนเป็นการประเมินเชิงประกอบจากข้อมูลที่รวบรวม อาจไม่ตรงกับสถานการณ์
          ปัจจุบัน · การเทรด Forex มีความเสี่ยงสูง อาจสูญเสียเงินลงทุนทั้งหมด —
          ไม่ใช่คำแนะนำการลงทุน โปรดตรวจสอบใบอนุญาตและเงื่อนไขกับโบรกเกอร์โดยตรง
        </aside>

        <div className="mt-8">
          <Link
            href="/brokers"
            className="text-sm font-semibold text-accent hover:underline"
          >
            ← ดูโบรกเกอร์ทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
}

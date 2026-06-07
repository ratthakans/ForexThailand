import Link from "next/link";
import { query, type Article } from "@/lib/db";
import { categoryLabel, formatThaiDate } from "@/lib/format";
import { PROMOS, getBroker } from "@/lib/brokers";
import { NewsImage } from "@/components/NewsImage";
import { PromoCarousel, type PromoSlide } from "@/components/PromoCarousel";
import TradingViewForex from "@/components/TradingViewForex";
import EconomicCalendar from "@/components/EconomicCalendar";
import { LiveStream } from "@/components/LiveStream";

export const revalidate = 60;

async function getArticles(): Promise<Article[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL ยังไม่ได้ตั้งค่า — แสดง empty state");
    return [];
  }
  try {
    const { rows } = await query<Article>(
      `SELECT id, source_url, title_th, body_th, img_type, image_url,
              image_credit, category, status, fb_post_id, created_at,
              hook, author
         FROM articles
        WHERE coalesce(status, '') <> 'rejected'
          AND trim(coalesce(title_th, '')) <> ''
        ORDER BY created_at DESC`
    );
    return rows;
  } catch (err) {
    console.warn("getArticles failed:", err);
    return [];
  }
}

function Chip({ category }: { category: string }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
      {categoryLabel(category)}
    </span>
  );
}

function SectionHeader({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="bg-gold h-4 w-1.5 rounded-full" aria-hidden />
      <h2
        className={`font-display text-lg font-bold tracking-tight ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {children}
      </h2>
      <span className={`h-px flex-1 ${dark ? "bg-white/15" : "bg-line"}`} />
    </div>
  );
}

/** ข่าวเด่น (Hot Issue) — รูปใหญ่ซ้าย + หัวข้อขวา */
function Hero({ a }: { a: Article }) {
  return (
    <Link
      href={`/article/${a.id}`}
      className="group grid gap-6 md:grid-cols-12 md:gap-8"
    >
      <NewsImage
        src={a.image_url}
        alt={a.title_th}
        eager
        ratioClassName="aspect-[16/9]"
        sizes="(max-width: 768px) 100vw, 700px"
        className="md:col-span-7"
      />
      <div className="flex flex-col justify-center md:col-span-5">
        <Chip category={a.category} />
        <h1 className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent sm:text-[2.1rem] sm:leading-[1.15] lg:text-[2.5rem]">
          {a.title_th}
        </h1>
        <p className="mt-3 line-clamp-3 max-w-prose text-[15px] leading-relaxed text-ink-soft lg:text-base">
          {a.hook?.trim() || a.body_th}
        </p>
        <time className="mt-4 text-[11px] uppercase tracking-wide text-ink-soft">
          {formatThaiDate(a.created_at)}
        </time>
      </div>
    </Link>
  );
}

/** การ์ดในกริดข่าวล่าสุด */
function Card({ a }: { a: Article }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-md">
      <Link href={`/article/${a.id}`} className="flex flex-1 flex-col">
        <NewsImage
          src={a.image_url}
          alt={a.title_th}
          ratioClassName="aspect-[16/9]"
          sizes="(max-width: 640px) 100vw, 380px"
        />
        <div className="flex flex-1 flex-col p-4">
          <Chip category={a.category} />
          <h3 className="mt-1.5 font-display text-[17px] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
            {a.title_th}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-ink-soft">
            {a.hook?.trim() || a.body_th}
          </p>
          <time className="mt-3 block text-[11px] uppercase tracking-wide text-ink-soft">
            {formatThaiDate(a.created_at)}
          </time>
        </div>
      </Link>
    </article>
  );
}

/** รายการ "เรื่องเด่น" แบบมีเลขกำกับ (สไตล์ Most Popular) */
function RankItem({ a, rank }: { a: Article; rank: number }) {
  return (
    <li className="flex gap-4 border-b border-line py-4 last:border-b-0">
      <span className="font-display text-2xl font-bold leading-none text-accent/35">
        {String(rank).padStart(2, "0")}
      </span>
      <Link href={`/article/${a.id}`} className="group block min-w-0">
        <Chip category={a.category} />
        <h3 className="mt-1 font-display text-[15px] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
          {a.title_th}
        </h3>
        <time className="mt-1.5 block text-[11px] uppercase tracking-wide text-ink-soft">
          {formatThaiDate(a.created_at)}
        </time>
      </Link>
    </li>
  );
}

export default async function Home() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8 py-24 text-center">
        <p className="font-display text-xl font-bold text-ink">
          ยังไม่มีข่าวเผยแพร่ในขณะนี้
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          โปรดกลับมาตรวจสอบอีกครั้งในภายหลัง
        </p>
      </div>
    );
  }

  const lead = articles.find((a) => a.image_url) ?? articles[0];
  const others = articles.filter((a) => a.id !== lead.id);
  const ranked = others.slice(0, 5);
  const grid = others.slice(5);

  const latest = grid.length > 0 ? grid : ranked;

  const promoSlides: PromoSlide[] = PROMOS.map((p) => {
    const b = getBroker(p.brokerSlug);
    return b
      ? {
          slug: b.slug,
          name: b.name,
          domain: b.domain,
          rating: b.rating,
          badge: p.badge,
          title: p.title,
          desc: p.desc,
        }
      : null;
  }).filter((x): x is PromoSlide => x !== null);

  return (
    <>
      {/* ข่าวเด่น — พื้นขาว */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8 py-12 md:py-16">
          <SectionHeader>ข่าวเด่น</SectionHeader>
          <Hero a={lead} />
        </div>
      </section>

      {/* ถ่ายทอดสด — พื้นดำ */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8 py-12 md:py-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded bg-breaking px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
            <h2 className="font-display text-lg font-bold tracking-tight text-white">
              ถ่ายทอดสด
            </h2>
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <LiveStream videoId="iEpJwprxDdk" />
          <p className="mt-3 text-center text-xs text-white/50">
            ติดตามความเคลื่อนไหวตลาดแบบเรียลไทม์
          </p>
        </div>
      </section>

      {/* ข่าวล่าสุด + แถบข้าง — พื้นขาว */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <SectionHeader>ข่าวล่าสุด</SectionHeader>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {latest.map((a) => (
                  <Card key={a.id} a={a} />
                ))}
              </div>
            </div>

            <aside className="lg:col-span-1">
              <SectionHeader>อัตราแลกเปลี่ยน</SectionHeader>
              <div className="overflow-hidden rounded-xl border border-line bg-ink p-1">
                <TradingViewForex />
              </div>

              {ranked.length > 0 && (
                <div className="mt-8">
                  <SectionHeader>เรื่องเด่น</SectionHeader>
                  <ul>
                    {ranked.map((a, i) => (
                      <RankItem key={a.id} a={a} rank={i + 1} />
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* โปรโมชันแนะนำ — พื้นดำ */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8 py-12 md:py-16">
          <SectionHeader dark>โปรโมชันโบรกเกอร์แนะนำ</SectionHeader>
          <PromoCarousel slides={promoSlides} />
          <p className="mt-5 text-[11px] text-white/40">
            * โปรโมชันและเงื่อนไขอาจเปลี่ยนแปลง โปรดตรวจสอบล่าสุดที่เว็บไซต์โบรกเกอร์ ·
            การเทรดมีความเสี่ยง
          </p>
        </div>
      </section>

      {/* ปฏิทินเศรษฐกิจ — พื้นขาว */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-8 py-12 md:py-16">
          <SectionHeader>ปฏิทินเศรษฐกิจ</SectionHeader>
          <div className="overflow-hidden rounded-xl border border-line">
            <EconomicCalendar />
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { query, type Article } from "@/lib/db";
import { categoryLabel, formatThaiDate, truncate } from "@/lib/format";
import { PROMOS, getBroker } from "@/lib/brokers";
import { TOPICS } from "@/lib/topics";
import { NewsImage } from "@/components/NewsImage";
import { type CardArticle } from "@/components/ArticleCard";
import { NewsExplorer } from "@/components/NewsExplorer";
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

function toCard(a: Article): CardArticle {
  return {
    id: a.id,
    title_th: a.title_th,
    excerpt: a.hook?.trim() || truncate(a.body_th, 120),
    image_url: a.image_url,
    category: a.category,
    dateLabel: formatThaiDate(a.created_at),
  };
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
    <div className="mb-6 flex items-center gap-3">
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

/** ข่าวนำใหญ่ */
function Hero({ a }: { a: Article }) {
  return (
    <Link href={`/article/${a.id}`} className="group block">
      <NewsImage
        src={a.image_url}
        alt={a.title_th}
        eager
        ratioClassName="aspect-[16/9]"
        sizes="(max-width: 1024px) 100vw, 900px"
        className="mb-4"
      />
      <Chip category={a.category} />
      <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-accent sm:text-[2.1rem] lg:text-[2.6rem] lg:leading-[1.12]">
        {a.title_th}
      </h1>
      <p className="mt-3 line-clamp-2 max-w-prose text-[15px] leading-relaxed text-ink-soft lg:text-base">
        {a.hook?.trim() || a.body_th}
      </p>
      <time className="mt-3 block text-[11px] uppercase tracking-wide text-ink-soft">
        {formatThaiDate(a.created_at)}
      </time>
    </Link>
  );
}

/** เรื่องเด่นในคอลัมน์ข้าง ๆ ข่าวนำ */
function Highlight({ a }: { a: Article }) {
  return (
    <li className="border-b border-line py-3.5 first:pt-0 last:border-b-0">
      <Link href={`/article/${a.id}`} className="group flex items-start gap-3">
        <NewsImage
          src={a.image_url}
          alt={a.title_th}
          ratioClassName="aspect-[4/3]"
          sizes="92px"
          className="w-[92px] shrink-0"
        />
        <div className="min-w-0">
          <Chip category={a.category} />
          <h3 className="mt-0.5 line-clamp-2 font-display text-[14px] font-bold leading-snug text-ink transition-colors group-hover:text-accent">
            {a.title_th}
          </h3>
          <time className="mt-1 block text-[10px] uppercase tracking-wide text-ink-soft">
            {formatThaiDate(a.created_at)}
          </time>
        </div>
      </Link>
    </li>
  );
}

export default async function Home() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-8">
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
  const highlights = others.slice(0, 4);
  const newsCards = others.map(toCard);

  const tabs = TOPICS.map((t) => ({
    slug: t.slug,
    label: t.label,
    keywords: t.keywords,
  }));

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
      {/* ข่าวเด่น + เรื่องเด่น — พื้นขาว */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader>ข่าวเด่น</SectionHeader>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <Hero a={lead} />
            </div>
            {highlights.length > 0 && (
              <aside className="lg:col-span-4 lg:border-l lg:border-line lg:pl-8">
                <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-ink-soft">
                  เรื่องเด่น
                </h3>
                <ul>
                  {highlights.map((a) => (
                    <Highlight key={a.id} a={a} />
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ข่าวล่าสุด + แท็บหมวด (interactive) — พื้นเทาอ่อน */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader>ข่าวล่าสุด</SectionHeader>
          <NewsExplorer articles={newsCards} tabs={tabs} />
        </div>
      </section>

      {/* ตลาด & ถ่ายทอดสด — พื้นดำ */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div className="mb-6 flex items-center gap-3">
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
            </div>
            <div className="lg:col-span-5">
              <SectionHeader dark>อัตราแลกเปลี่ยน</SectionHeader>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-ink p-1">
                <TradingViewForex />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* โปรโมชันโบรกเกอร์ — พื้นขาว */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader>โปรโมชันโบรกเกอร์แนะนำ</SectionHeader>
          <PromoCarousel slides={promoSlides} />
          <p className="mt-4 text-[11px] text-ink-soft">
            * โปรโมชันและเงื่อนไขอาจเปลี่ยนแปลง โปรดตรวจสอบล่าสุดที่เว็บไซต์โบรกเกอร์ ·
            การเทรดมีความเสี่ยง
          </p>
        </div>
      </section>

      {/* ปฏิทินเศรษฐกิจ — พื้นเทาอ่อน */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader>ปฏิทินเศรษฐกิจ</SectionHeader>
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <EconomicCalendar />
          </div>
        </div>
      </section>
    </>
  );
}

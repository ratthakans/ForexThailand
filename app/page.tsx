import Link from "next/link";
import { query, type Article } from "@/lib/db";
import { formatThaiDate, truncate } from "@/lib/format";
import { PROMOS, getBroker, BROKERS } from "@/lib/brokers";
import { TOPICS } from "@/lib/topics";
import { type CardArticle } from "@/components/ArticleCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { NewsSlider } from "@/components/NewsSlider";
import { PromoCarousel, type PromoSlide } from "@/components/PromoCarousel";
import { BrokerLogo } from "@/components/BrokerLogo";
import AdvancedChart from "@/components/AdvancedChart";
import EconomicCalendar from "@/components/EconomicCalendar";
import { LiveStream } from "@/components/LiveStream";
import { LazyMount } from "@/components/LazyMount";

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

  const heroItems = articles
    .filter((a) => a.image_url)
    .slice(0, 6)
    .map(toCard);
  const newsItems = articles.map(toCard);
  const topBrokers = BROKERS.slice(0, 6);

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
      {/* ฮีโร่สไลด์ — เต็มความกว้าง (full-bleed) */}
      <HeroCarousel items={heroItems.length > 0 ? heroItems : newsItems.slice(0, 6)} />

      {/* ข่าวล่าสุด 2 แถว — พื้นขาว */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader>ข่าวล่าสุด</SectionHeader>
          <NewsSlider articles={newsItems} tabs={tabs} />
        </div>
      </section>

      {/* ภาพรวมตลาด (เต็มความกว้าง) — พื้นดำ */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader dark>กราฟราคาตลาด</SectionHeader>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f]">
            <LazyMount minHeight={560}>
              <div className="h-[440px] sm:h-[560px]">
                <AdvancedChart />
              </div>
            </LazyMount>
          </div>
        </div>
      </section>

      {/* ถ่ายทอดสด (เต็มความกว้าง) — พื้นขาว */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded bg-breaking px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
            <h2 className="font-display text-lg font-bold tracking-tight text-ink">
              ถ่ายทอดสด
            </h2>
            <span className="h-px flex-1 bg-line" />
          </div>
          <LiveStream videoId="iEpJwprxDdk" />
          <p className="mt-3 text-center text-xs text-ink-soft">
            ติดตามความเคลื่อนไหวตลาดแบบเรียลไทม์
          </p>
        </div>
      </section>

      {/* รีวิวโบรกเกอร์ & โปรโมชัน — พื้นดำ */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader dark>รีวิวโบรกเกอร์ &amp; โปรโมชัน</SectionHeader>
          <PromoCarousel slides={promoSlides} />

          <div className="mt-8 flex items-center justify-between gap-4">
            <h3 className="font-display text-base font-bold text-white">
              โบรกเกอร์ยอดนิยม
            </h3>
            <Link
              href="/brokers"
              className="text-sm font-semibold text-accent hover:underline"
            >
              ดูรีวิวทั้ง 50 โบรกเกอร์ →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {topBrokers.map((b) => (
              <Link
                key={b.slug}
                href={`/brokers/${b.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center transition-all hover:-translate-y-1 hover:border-accent hover:bg-white/[0.07]"
              >
                <BrokerLogo domain={b.domain} name={b.name} size={48} />
                <span className="font-display text-sm font-bold leading-tight text-white">
                  {b.name}
                </span>
                <span className="text-[12px] tracking-wide text-accent">
                  {"★".repeat(b.rating)}
                  <span className="text-white/20">{"★".repeat(5 - b.rating)}</span>
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-white/40">
            * โปรโมชันและเงื่อนไขอาจเปลี่ยนแปลง โปรดตรวจสอบล่าสุดที่เว็บไซต์โบรกเกอร์ ·
            การเทรดมีความเสี่ยง
          </p>
        </div>
      </section>

      {/* ปฏิทินเศรษฐกิจ — พื้นขาว */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader>ปฏิทินเศรษฐกิจ</SectionHeader>
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <LazyMount minHeight={540}>
              <EconomicCalendar />
            </LazyMount>
          </div>
        </div>
      </section>
    </>
  );
}

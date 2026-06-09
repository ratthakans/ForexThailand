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
import { LiveBackground } from "@/components/LiveBackground";
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
    author: a.author,
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

      {/* ถ่ายทอดสด — วิดีโอเป็นพื้นหลังเต็มจอ (autoplay มิวต์) */}
      <section className="relative h-[58vh] min-h-[420px] overflow-hidden bg-ink">
        <LiveBackground videoId="iEpJwprxDdk" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-10 lg:px-8 lg:pb-14">
          <span className="flex w-fit items-center gap-1.5 rounded bg-breaking px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            LIVE
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white drop-shadow-sm sm:text-4xl">
            ถ่ายทอดสดตลาดการเงิน
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
            ติดตามความเคลื่อนไหวตลาดแบบเรียลไทม์ตลอดทั้งวัน
          </p>
          <a
            href={`https://www.youtube.com/watch?v=iEpJwprxDdk`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold mt-5 inline-flex w-fit items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold text-black transition-transform hover:translate-x-1"
          >
            ดูแบบเต็มจอ / เปิดเสียง ↗
          </a>
        </div>
      </section>

      {/* รีวิวโบรกเกอร์ & โปรโมชัน — พื้นดำ */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
          <SectionHeader dark>รีวิวโบรกเกอร์ &amp; โปรโมชัน</SectionHeader>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* ซ้าย: โปรโมชัน */}
            <div className="lg:col-span-7">
              <PromoCarousel slides={promoSlides} />
              <p className="mt-4 text-[11px] text-white/40">
                * โปรโมชันและเงื่อนไขอาจเปลี่ยนแปลง โปรดตรวจสอบล่าสุดที่เว็บไซต์
                โบรกเกอร์ · การเทรดมีความเสี่ยง
              </p>
            </div>

            {/* ขวา: รีวิวโบรกเกอร์ยอดนิยม */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-base font-bold text-white">
                  โบรกเกอร์ยอดนิยม
                </h3>
                <Link
                  href="/brokers"
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  ดูทั้ง 50 →
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.04]">
                {topBrokers.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/brokers/${b.slug}`}
                      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-[12px] font-bold text-white">
                        {b.rank}
                      </span>
                      <BrokerLogo domain={b.domain} name={b.name} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-sm font-bold text-white group-hover:text-accent">
                          {b.name}
                        </span>
                        <span className="text-[12px] tracking-wide text-accent">
                          {"★".repeat(b.rating)}
                          <span className="text-white/20">
                            {"★".repeat(5 - b.rating)}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 text-white/30 transition-colors group-hover:text-accent">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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

import type { Metadata } from "next";
import Link from "next/link";
import { query, type Article } from "@/lib/db";
import { formatThaiDate, truncate } from "@/lib/format";
import { ArticleCard, type CardArticle } from "@/components/ArticleCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "บทวิเคราะห์",
  description:
    "บทวิเคราะห์ตลาดการเงิน ค่าเงิน ทองคำ และเศรษฐกิจ — เจาะลึกสถานการณ์ ผลกระทบ และมุมมองจากกองบรรณาธิการ Forex Thailand",
  alternates: { canonical: "/insight" },
  openGraph: {
    type: "website",
    url: "/insight",
    siteName: "Forex Thailand",
    locale: "th_TH",
    title: "บทวิเคราะห์ — Forex Thailand",
    description:
      "เจาะลึกสถานการณ์ตลาดการเงิน ค่าเงิน ทองคำ และเศรษฐกิจ พร้อมมุมมองวิเคราะห์",
    images: [{ url: "/og-default", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default"] },
};

async function getInsights(): Promise<Article[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const { rows } = await query<Article>(
      `SELECT id, source_url, title_th, body_th, img_type, image_url,
              image_credit, category, status, fb_post_id, created_at,
              hook, author
         FROM articles
        WHERE category = 'insight'
          AND coalesce(status, '') NOT IN ('rejected', 'failed')
          AND trim(coalesce(title_th, '')) <> ''
        ORDER BY created_at DESC
        LIMIT 30`
    );
    return rows;
  } catch (err) {
    console.warn("getInsights failed:", err);
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

export default async function InsightPage() {
  const articles = await getInsights();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-10 lg:px-8">
      <header className="border-b-2 border-ink pb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
          Insight
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
          บทวิเคราะห์
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          เจาะลึกสถานการณ์ตลาดการเงิน ค่าเงิน ทองคำ และเศรษฐกิจ —
          สถานการณ์ ผลกระทบ และมุมมองจากกองบรรณาธิการ
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-lg font-bold text-ink">
            ยังไม่มีบทวิเคราะห์ในขณะนี้
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            โปรดกลับมาตรวจสอบอีกครั้งในภายหลัง
          </p>
          <Link
            href="/"
            className="mt-5 inline-block text-sm font-semibold text-accent hover:underline"
          >
            ← กลับสู่หน้าแรก
          </Link>
        </div>
      ) : (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} a={toCard(a)} />
          ))}
        </section>
      )}
    </div>
  );
}

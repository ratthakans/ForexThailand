import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { query, type Article } from "@/lib/db";
import { TOPICS, getTopic } from "@/lib/topics";
import { formatThaiDate, truncate } from "@/lib/format";
import { ArticleCard, type CardArticle } from "@/components/ArticleCard";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = getTopic(slug);
  if (!t) return { title: "ไม่พบหมวดข่าว" };
  return {
    title: `ข่าว${t.label}`,
    description: `รวมข่าว${t.label}ล่าสุด — ความเคลื่อนไหว ราคา และบทวิเคราะห์ จาก Forex Thailand`,
    alternates: { canonical: `/topic/${t.slug}` },
    openGraph: {
      type: "website",
      url: `/topic/${t.slug}`,
      siteName: "Forex Thailand",
      locale: "th_TH",
      title: `ข่าว${t.label} — Forex Thailand`,
      description: `รวมข่าว${t.label}ล่าสุดและบทวิเคราะห์`,
      images: [{ url: "/og-default", width: 1200, height: 630 }],
    },
  };
}

async function getByTopic(keywords: string[]): Promise<CardArticle[]> {
  if (!process.env.DATABASE_URL) return [];
  const patterns = keywords.map((k) => `%${k}%`);
  try {
    const { rows } = await query<Article>(
      `SELECT id, title_th, body_th, image_url, category, hook, created_at
         FROM articles
        WHERE coalesce(status, '') <> 'rejected'
          AND trim(coalesce(title_th, '')) <> ''
          AND (title_th ILIKE ANY($1::text[]) OR body_th ILIKE ANY($1::text[]))
        ORDER BY created_at DESC
        LIMIT 60`,
      [patterns]
    );
    return rows.map((a) => ({
      id: a.id,
      title_th: a.title_th,
      excerpt: a.hook?.trim() || truncate(a.body_th, 120),
      image_url: a.image_url,
      category: a.category,
      dateLabel: formatThaiDate(a.created_at),
    }));
  } catch (err) {
    console.warn("getByTopic failed:", err);
    return [];
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();
  const articles = await getByTopic(topic.keywords);

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:px-8">
        <header className="border-b-2 border-ink pb-6">
          <nav className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            <Link href="/" className="hover:text-ink">
              หน้าแรก
            </Link>
            <span className="mx-2">›</span>
            <span className="text-accent">{topic.label}</span>
          </nav>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            ข่าว{topic.label}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            รวมข่าว{topic.label}ล่าสุด ความเคลื่อนไหวราคาและบทวิเคราะห์
          </p>
        </header>

        <div className="mt-8">
          {articles.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line py-16 text-center text-sm text-ink-soft">
              ยังไม่มีข่าวในหมวดนี้ในขณะนี้
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles.map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

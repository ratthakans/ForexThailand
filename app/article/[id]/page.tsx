import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { query, type Article } from "@/lib/db";
import {
  categoryLabel,
  formatThaiDateTime,
  toParagraphs,
  truncate,
} from "@/lib/format";
import { NewsImage } from "@/components/NewsImage";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

// cache() → generateMetadata กับ page component เรียก getArticle ตัวเดียวกัน
// ใน request เดียว จะ query DB แค่ครั้งเดียว (เร็วขึ้น ลดภาระ Neon ตอน bot มา scrape)
const getArticle = cache(async (idRaw: string): Promise<Article | null> => {
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) return null;
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL ยังไม่ได้ตั้งค่า");
    return null;
  }
  try {
    const { rows } = await query<Article>(
      `SELECT id, source_url, title_th, body_th, img_type, image_url,
              image_credit, category, status, fb_post_id, created_at,
              hook, author
         FROM articles
        WHERE id = $1
          AND status IN ('approved', 'posted')
          AND trim(coalesce(title_th, '')) <> ''
        LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  } catch (err) {
    console.warn("getArticle failed:", err);
    return null;
  }
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return { title: "ไม่พบบทความ" };
  }

  // คำโปรย: ใช้ hook ก่อน ถ้าว่าง fallback เป็น body_th 150 ตัวแรก
  const description = article.hook?.trim()
    ? article.hook.trim()
    : truncate(article.body_th, 150);

  // ภาพ: ใช้ image_url (Pexels absolute) ถ้าไม่มีให้ fallback ภาพแบรนด์ default
  // (ทั้งคู่จะกลายเป็น absolute URL ผ่าน metadataBase → www.forexthailand.co)
  const ogImage = article.image_url
    ? { url: article.image_url, alt: article.title_th }
    : { url: "/og-default", width: 1200, height: 630, alt: article.title_th };

  const path = `/article/${article.id}`;

  return {
    title: article.title_th,
    description,
    authors: article.author ? [{ name: article.author }] : undefined,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: "Forex Thailand",
      locale: "th_TH",
      title: article.title_th,
      description,
      publishedTime: article.created_at.toISOString(),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title_th,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) notFound();

  const paragraphs = toParagraphs(article.body_th);

  const breaking = article.category === "breaking";

  return (
    <article className="mx-auto max-w-2xl px-5 py-8 md:py-12">
      {/* breadcrumb */}
      <nav className="mb-5 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        <Link href="/" className="hover:text-ink">
          หน้าแรก
        </Link>
        <span className="mx-2">›</span>
        <span className={breaking ? "text-breaking" : "text-accent"}>
          {categoryLabel(article.category)}
        </span>
      </nav>

      {/* headline */}
      <header>
        <span
          className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
            breaking ? "text-breaking" : "text-accent"
          }`}
        >
          {categoryLabel(article.category)}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-[2.4rem] sm:leading-[1.15]">
          {article.title_th}
        </h1>
        <time className="mt-4 block border-b border-line pb-5 text-xs uppercase tracking-wide text-ink-soft">
          {formatThaiDateTime(article.created_at)}
        </time>
      </header>

      {/* รูปประกอบ + เครดิต — ถ้ารูปพัง/ไม่มี จะไม่แสดงทั้งบล็อก */}
      <NewsImage
        src={article.image_url}
        alt={article.title_th}
        eager
        credit={article.image_credit}
        ratioClassName="aspect-[16/9]"
        sizes="(max-width: 768px) 100vw, 768px"
        className="mt-6"
      />

      {/* เนื้อหา */}
      <div className="mt-8 space-y-5 text-[18px] leading-[1.95] text-ink">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* ที่มา */}
      {article.source_url && (
        <p className="mt-9 border-t border-line pt-5 text-sm text-ink-soft">
          ที่มา:{" "}
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-accent underline underline-offset-2 hover:no-underline"
          >
            {article.source_url}
          </a>
        </p>
      )}

      {/* disclaimer — ต้องมีท้ายทุกหน้าบทความ */}
      <aside className="mt-8 border-l-[3px] border-accent bg-accent/[0.05] px-4 py-3 text-[13px] leading-relaxed text-ink-soft">
        บทความนี้เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำการลงทุน การเทรดมีความเสี่ยง
      </aside>

      {/* กลับหน้าแรก */}
      <div className="mt-10">
        <Link
          href="/"
          className="text-sm font-semibold text-accent underline-offset-2 hover:underline"
        >
          ← กลับสู่หน้าแรก
        </Link>
      </div>
    </article>
  );
}

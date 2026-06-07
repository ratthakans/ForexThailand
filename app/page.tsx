import Link from "next/link";
import { query, type Article } from "@/lib/db";
import { categoryLabel, formatThaiDate } from "@/lib/format";
import { NewsImage } from "@/components/NewsImage";

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

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="bg-gold h-4 w-1.5 rounded-full" aria-hidden />
      <h2 className="font-display text-lg font-bold tracking-tight text-ink">
        {children}
      </h2>
      <span className="h-px flex-1 bg-line" />
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
        <h1 className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent sm:text-[1.9rem] sm:leading-[1.18]">
          {a.title_th}
        </h1>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">
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
    <article>
      <Link href={`/article/${a.id}`} className="group block">
        <NewsImage
          src={a.image_url}
          alt={a.title_th}
          ratioClassName="aspect-[16/10]"
          sizes="(max-width: 640px) 100vw, 360px"
          className="mb-3"
        />
        <Chip category={a.category} />
        <h3 className="mt-1.5 font-display text-base font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
          {a.title_th}
        </h3>
        <time className="mt-2 block text-[11px] uppercase tracking-wide text-ink-soft">
          {formatThaiDate(a.created_at)}
        </time>
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
      <div className="mx-auto max-w-6xl px-5 py-24 text-center">
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

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
      {/* HOT ISSUE */}
      <section className="border-b border-line pb-10">
        <SectionHeader>ข่าวเด่น</SectionHeader>
        <Hero a={lead} />
      </section>

      {/* MAIN: ข่าวล่าสุด + เรื่องเด่น */}
      <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          {grid.length > 0 ? (
            <>
              <SectionHeader>ข่าวล่าสุด</SectionHeader>
              <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2">
                {grid.map((a) => (
                  <Card key={a.id} a={a} />
                ))}
              </div>
            </>
          ) : (
            <>
              <SectionHeader>ข่าวล่าสุด</SectionHeader>
              <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2">
                {ranked.map((a) => (
                  <Card key={a.id} a={a} />
                ))}
              </div>
            </>
          )}
        </div>

        {ranked.length > 0 && (
          <aside className="lg:col-span-1">
            <SectionHeader>เรื่องเด่น</SectionHeader>
            <ul>
              {ranked.map((a, i) => (
                <RankItem key={a.id} a={a} rank={i + 1} />
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}

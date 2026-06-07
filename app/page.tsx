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
              image_credit, category, status, fb_post_id, created_at
         FROM articles
        WHERE status IN ('approved', 'posted')
        ORDER BY created_at DESC`
    );
    return rows;
  } catch (err) {
    // อย่าให้หน้าเว็บล่มถ้า DB ต่อไม่ได้ — log แล้วแสดง empty state
    console.warn("getArticles failed:", err);
    return [];
  }
}

function Kicker({ category }: { category: string }) {
  const breaking = category === "breaking";
  return (
    <span
      className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
        breaking ? "text-breaking" : "text-accent"
      }`}
    >
      {categoryLabel(category)}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 border-b-2 border-ink pb-2">
      <h2 className="font-serif text-base font-bold uppercase tracking-wide text-ink">
        {children}
      </h2>
    </div>
  );
}

/** ข่าวนำใหญ่ */
function Lead({ a }: { a: Article }) {
  return (
    <Link href={`/article/${a.id}`} className="group block">
      <NewsImage
        src={a.image_url}
        alt={a.title_th}
        eager
        ratioClassName="aspect-[16/9]"
        sizes="(max-width: 1024px) 100vw, 680px"
        className="mb-4"
      />
      <Kicker category={a.category} />
      <h2 className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-accent sm:text-[2rem] sm:leading-[1.12]">
        {a.title_th}
      </h2>
      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">
        {a.body_th}
      </p>
      <time className="mt-3 block text-[11px] uppercase tracking-wide text-ink-soft">
        {formatThaiDate(a.created_at)}
      </time>
    </Link>
  );
}

/** รายการ "เรื่องเด่น" ข้าง ๆ ข่าวนำ — มี thumbnail เล็ก (ยุบเองถ้าไม่มีรูป) */
function SideStory({ a }: { a: Article }) {
  return (
    <li className="py-4 first:pt-0">
      <Link href={`/article/${a.id}`} className="group flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <Kicker category={a.category} />
          <h3 className="mt-1 font-serif text-base font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
            {a.title_th}
          </h3>
          <time className="mt-1.5 block text-[11px] uppercase tracking-wide text-ink-soft">
            {formatThaiDate(a.created_at)}
          </time>
        </div>
        <NewsImage
          src={a.image_url}
          alt={a.title_th}
          ratioClassName="aspect-square"
          sizes="80px"
          className="w-20 shrink-0"
        />
      </Link>
    </li>
  );
}

/** การ์ดในกริดข่าวล่าสุด */
function StoryCard({ a }: { a: Article }) {
  return (
    <article>
      <Link href={`/article/${a.id}`} className="group block">
        <NewsImage
          src={a.image_url}
          alt={a.title_th}
          ratioClassName="aspect-[16/10]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="mb-3"
        />
        <Kicker category={a.category} />
        <h3 className="mt-1.5 font-serif text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
          {a.title_th}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {a.body_th}
        </p>
        <time className="mt-2.5 block text-[11px] uppercase tracking-wide text-ink-soft">
          {formatThaiDate(a.created_at)}
        </time>
      </Link>
    </article>
  );
}

export default async function Home() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-24 text-center">
        <p className="font-serif text-xl font-bold text-ink">
          ยังไม่มีข่าวเผยแพร่ในขณะนี้
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          โปรดกลับมาตรวจสอบอีกครั้งในภายหลัง
        </p>
      </div>
    );
  }

  // เลือกข่าวนำเป็นข่าวล่าสุด "ที่มีรูป" เพื่อให้ hero มีภาพเด่นเสมอ
  // (ถ้าไม่มีข่าวไหนมีรูปเลย ใช้ข่าวล่าสุด) — ที่เหลือเรียงตามวันที่เดิม
  const lead = articles.find((a) => a.image_url) ?? articles[0];
  const others = articles.filter((a) => a.id !== lead.id);
  const side = others.slice(0, 4);
  const rest = others.slice(4);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-10">
      {/* HERO: ข่าวนำ + เรื่องเด่น */}
      <section className="border-b border-line pb-10">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className={side.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
            <Lead a={lead} />
          </div>

          {side.length > 0 && (
            <aside className="lg:col-span-1 lg:border-l lg:border-line lg:pl-8">
              <h2 className="mb-2 border-b-2 border-ink pb-2 font-serif text-base font-bold uppercase tracking-wide text-ink">
                เรื่องเด่น
              </h2>
              <ul className="divide-y divide-line">
                {side.map((a) => (
                  <SideStory key={a.id} a={a} />
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>

      {/* ข่าวล่าสุด */}
      {rest.length > 0 && (
        <section className="mt-10">
          <SectionLabel>ข่าวล่าสุด</SectionLabel>
          <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <StoryCard key={a.id} a={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

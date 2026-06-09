import Link from "next/link";
import { NewsImage } from "@/components/NewsImage";
import { categoryLabel } from "@/lib/format";

export type CardArticle = {
  id: number;
  title_th: string;
  excerpt: string;
  image_url: string | null;
  category: string;
  dateLabel: string;
  author?: string | null;
};

/** การ์ดข่าวมาตรฐาน (ใช้ทั้งหน้าแรก/หน้าหมวด) — ไม่มี hook จึงใช้ได้ทั้ง server/client */
export function ArticleCard({ a }: { a: CardArticle }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-all hover:-translate-y-1 hover:border-ink/20 hover:shadow-lg">
      <Link href={`/article/${a.id}`} className="flex flex-1 flex-col">
        <NewsImage
          src={a.image_url}
          alt={a.title_th}
          ratioClassName="aspect-[16/9]"
          sizes="(max-width: 640px) 100vw, 380px"
        />
        <div className="flex flex-1 flex-col p-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            {categoryLabel(a.category)}
          </span>
          <h3 className="mt-1.5 font-display text-[17px] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
            {a.title_th}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-ink-soft">
            {a.excerpt}
          </p>
          <time className="mt-3 block text-[11px] tracking-wide text-ink-soft">
            {a.author?.trim() ? `โดย ${a.author.trim()} · ${a.dateLabel}` : a.dateLabel}
          </time>
        </div>
      </Link>
    </article>
  );
}

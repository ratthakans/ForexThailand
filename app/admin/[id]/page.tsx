import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { query, type Article } from "@/lib/db";
import {
  EditArticleForm,
  type EditableArticle,
} from "@/components/EditArticleForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แก้ไขบทความ",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

async function getForEdit(idRaw: string): Promise<EditableArticle | null> {
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) return null;
  if (!process.env.DATABASE_URL) return null;
  try {
    const { rows } = await query<Article>(
      `SELECT id, title_th, hook, body_th, image_url, image_credit,
              category, author, status
         FROM articles
        WHERE id = $1
        LIMIT 1`,
      [id]
    );
    const a = rows[0];
    if (!a) return null;
    return {
      id: a.id,
      title_th: a.title_th ?? "",
      hook: a.hook ?? "",
      body_th: a.body_th ?? "",
      image_url: a.image_url ?? "",
      image_credit: a.image_credit ?? "",
      category: a.category ?? "general",
      author: a.author ?? "",
      status: a.status ?? "approved",
    };
  } catch (err) {
    console.warn("getForEdit failed:", err);
    return null;
  }
}

export default async function EditPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getForEdit(id);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 md:py-10">
      <header className="mb-6 border-b border-line pb-5">
        <Link
          href="/admin"
          className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          ← จัดการบทความ
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          แก้ไขบทความ #{article.id}
        </h1>
      </header>

      <EditArticleForm article={article} />
    </div>
  );
}

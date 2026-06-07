import type { Metadata } from "next";
import Link from "next/link";
import { query, type Article } from "@/lib/db";
import { formatThaiDateTime } from "@/lib/format";
import { AdminManager, type AdminArticle } from "@/components/AdminManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "จัดการบทความ",
  robots: { index: false, follow: false },
};

async function getAll(): Promise<AdminArticle[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL ยังไม่ได้ตั้งค่า — หน้า admin ว่าง");
    return [];
  }
  try {
    const { rows } = await query<Article>(
      `SELECT id, title_th, image_url, category, status, created_at
         FROM articles
        ORDER BY created_at DESC
        LIMIT 200`
    );
    return rows.map((a) => ({
      id: a.id,
      title_th: a.title_th || "(ไม่มีหัวข้อ)",
      image_url: a.image_url,
      category: a.category,
      status: a.status,
      created_at_label: formatThaiDateTime(a.created_at),
    }));
  } catch (err) {
    console.warn("getAll failed:", err);
    return [];
  }
}

export default async function AdminPage() {
  const articles = await getAll();
  const live = articles.filter((a) => a.status !== "rejected").length;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-10">
      <header className="mb-6 border-b border-line pb-5">
        <Link
          href="/"
          className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          ← Forex Thailand
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          จัดการบทความ
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          บทความขึ้นเว็บอัตโนมัติ (ไม่ต้องอนุมัติ) · กด “แก้ไข” เพื่อปรับเนื้อหา ·
          กด “ซ่อน” เพื่อไม่ให้แสดงบนเว็บ
        </p>
        <p className="mt-2 text-xs text-ink-soft">
          ทั้งหมด <strong className="text-ink">{articles.length}</strong> บทความ
          · เผยแพร่อยู่ <strong className="text-accent">{live}</strong>
        </p>
      </header>

      <AdminManager initial={articles} />
    </div>
  );
}

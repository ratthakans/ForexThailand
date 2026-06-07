import type { Metadata } from "next";
import { query, type Article } from "@/lib/db";
import { formatThaiDateTime } from "@/lib/format";
import {
  AdminReviewList,
  type PendingArticle,
} from "@/components/AdminReviewList";

// หน้ารีวิวต้องเห็นข้อมูลสดเสมอ ห้าม cache
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "รีวิวข่าว",
  robots: { index: false, follow: false },
};

async function getPending(): Promise<PendingArticle[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL ยังไม่ได้ตั้งค่า — หน้า admin แสดงรายการว่าง");
    return [];
  }
  try {
    const { rows } = await query<Article>(
      `SELECT id, source_url, title_th, body_th, img_type, image_url,
              image_credit, category, status, fb_post_id, created_at
         FROM articles
        WHERE status = 'pending_review'
        ORDER BY created_at DESC`
    );
    // serialize ให้ส่งเข้า client component ได้ (Date → string)
    return rows.map((a) => ({
      id: a.id,
      source_url: a.source_url,
      title_th: a.title_th,
      body_th: a.body_th,
      image_url: a.image_url,
      image_credit: a.image_credit,
      category: a.category,
      created_at: a.created_at.toISOString(),
      created_at_label: formatThaiDateTime(a.created_at),
    }));
  } catch (err) {
    console.warn("getPending failed:", err);
    return [];
  }
}

export default async function AdminPage() {
  const pending = await getPending();

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-10">
      <header className="mb-6 border-b border-line pb-5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
          รีวิวข่าวก่อนเผยแพร่
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          อนุมัติ = เผยแพร่บนเว็บ + ส่งไปโพส Facebook ผ่าน n8n · ปฏิเสธ =
          ไม่เผยแพร่
        </p>
        <p className="mt-2 text-xs text-ink-soft">
          รอรีวิว{" "}
          <strong className="text-ink">{pending.length}</strong> รายการ
        </p>
      </header>

      <AdminReviewList initial={pending} />
    </div>
  );
}

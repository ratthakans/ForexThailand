import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type Action = "approve" | "reject";

const STATUS_BY_ACTION: Record<Action, string> = {
  approve: "approved",
  reject: "rejected",
};

/**
 * POST /api/review — อนุมัติ/ปฏิเสธข่าวจากหน้า /admin
 * body: { id: number, action: 'approve' | 'reject' }
 * หลัง approve สำเร็จจะยิง webhook ไป n8n เพื่อโพส Facebook (ถ้าตั้ง env ไว้)
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ต้องส่ง JSON body" }, { status: 400 });
  }

  const { id, action } = (body ?? {}) as { id?: unknown; action?: unknown };

  // กันพลาด: id ต้องเป็นจำนวนเต็มบวก, action ต้องถูกต้องเท่านั้น
  const articleId = Number(id);
  if (!Number.isInteger(articleId) || articleId <= 0) {
    return NextResponse.json(
      { error: "id ต้องเป็นตัวเลขจำนวนเต็มบวก" },
      { status: 400 }
    );
  }
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json(
      { error: "action ต้องเป็น 'approve' หรือ 'reject'" },
      { status: 400 }
    );
  }

  const newStatus = STATUS_BY_ACTION[action];

  let rowCount: number | null;
  try {
    // อัปเดตเฉพาะข่าวที่ยังรอรีวิวอยู่ กันกดซ้ำ/กดแข่งกันสองคน
    ({ rowCount } = await query(
      `UPDATE articles
          SET status = $1
        WHERE id = $2
          AND status = 'pending_review'`,
      [newStatus, articleId]
    ));
  } catch (err) {
    console.error("review update failed:", err);
    return NextResponse.json(
      { error: "อัปเดตฐานข้อมูลไม่สำเร็จ" },
      { status: 500 }
    );
  }

  if (!rowCount) {
    return NextResponse.json(
      { error: "ไม่พบข่าวนี้ หรือถูกรีวิวไปแล้ว" },
      { status: 404 }
    );
  }

  // หลังอนุมัติ: ยิงไป n8n เพื่อโพส Facebook ทันที
  // ถ้า env ว่างให้ข้าม / ถ้ายิงพังก็อย่าให้การอนุมัติล้มเหลว (อนุมัติใน DB ไปแล้ว)
  let webhook: "sent" | "skipped" | "failed" = "skipped";
  if (action === "approve") {
    const webhookUrl = process.env.N8N_PUBLISH_WEBHOOK;
    if (!webhookUrl) {
      console.log(
        `[n8n] ข้ามการยิง webhook (N8N_PUBLISH_WEBHOOK ไม่ได้ตั้ง) — ข่าว #${articleId} อนุมัติใน DB อย่างเดียว`
      );
    } else {
      const payload = { id: articleId };
      console.log(
        `[n8n] กำลังยิง POST → ${webhookUrl} body=${JSON.stringify(payload)}`
      );
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        webhook = res.ok ? "sent" : "failed";
        // อ่าน body กลับมา log ไว้ debug (n8n มักตอบ JSON/ข้อความสั้น ๆ)
        const resText = await res.text().catch(() => "");
        if (res.ok) {
          console.log(
            `[n8n] ✓ ยิงสำเร็จ ข่าว #${articleId} (HTTP ${res.status}) resp=${resText.slice(0, 300)}`
          );
        } else {
          console.error(
            `[n8n] ✕ webhook ตอบ HTTP ${res.status} ข่าว #${articleId} resp=${resText.slice(0, 300)}`
          );
        }
      } catch (err) {
        webhook = "failed";
        console.error(`[n8n] ✕ ยิง webhook ไม่สำเร็จ ข่าว #${articleId}:`, err);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    id: articleId,
    status: newStatus,
    webhook,
  });
}

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const STATUSES = ["pending_review", "approved", "posted", "rejected"];

/**
 * POST /api/article — แก้ไขบทความจากหน้า /admin (ป้องกันด้วย Basic Auth ผ่าน proxy.ts)
 *
 * 2 โหมด:
 *  - statusOnly: true  → อัปเดตเฉพาะ status (ใช้ปุ่มซ่อน/แสดงในลิสต์)
 *  - ปกติ              → อัปเดตทุกฟิลด์ที่แก้ได้ (จากฟอร์มแก้ไข)
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "ต้องส่ง JSON body" }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
  }

  // โหมดสลับสถานะอย่างเดียว (ซ่อน/แสดง)
  if (body.statusOnly === true) {
    const status = String(body.status ?? "");
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: "status ไม่ถูกต้อง" }, { status: 400 });
    }
    try {
      const { rowCount } = await query(
        `UPDATE articles SET status = $1 WHERE id = $2`,
        [status, id]
      );
      if (!rowCount)
        return NextResponse.json({ error: "ไม่พบบทความ" }, { status: 404 });
      return NextResponse.json({ ok: true, id, status });
    } catch (err) {
      console.error("status update failed:", err);
      return NextResponse.json({ error: "อัปเดตไม่สำเร็จ" }, { status: 500 });
    }
  }

  // โหมดแก้ไขเต็ม
  const title_th = String(body.title_th ?? "").trim();
  if (!title_th) {
    return NextResponse.json({ error: "หัวข้อห้ามว่าง" }, { status: 400 });
  }
  const hook = body.hook ? String(body.hook).trim() : null;
  const body_th = String(body.body_th ?? "");
  const image_url = body.image_url ? String(body.image_url).trim() : null;
  const image_credit = body.image_credit ? String(body.image_credit).trim() : null;
  const category = body.category ? String(body.category) : "general";
  const author = body.author ? String(body.author).trim() : null;
  const status = STATUSES.includes(String(body.status))
    ? String(body.status)
    : "approved";

  try {
    const { rowCount } = await query(
      `UPDATE articles
          SET title_th = $1, hook = $2, body_th = $3, image_url = $4,
              image_credit = $5, category = $6, author = $7, status = $8
        WHERE id = $9`,
      [title_th, hook, body_th, image_url, image_credit, category, author, status, id]
    );
    if (!rowCount)
      return NextResponse.json({ error: "ไม่พบบทความ" }, { status: 404 });
    return NextResponse.json({ ok: true, id, status });
  } catch (err) {
    console.error("article update failed:", err);
    return NextResponse.json(
      { error: "อัปเดตฐานข้อมูลไม่สำเร็จ" },
      { status: 500 }
    );
  }
}

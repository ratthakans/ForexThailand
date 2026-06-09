import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/** POST /api/partner — รับฟอร์มติดต่อ/พาร์ทเนอร์ (เก็บ lead ให้ทีมขายติดต่อกลับ) */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "ต้องส่ง JSON body" }, { status: 400 });
  }

  const s = (v: unknown, max = 500) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const name = s(body.name, 120);
  const phone = s(body.phone, 40);
  const company = s(body.company, 160);
  const email = s(body.email, 160);
  const interest = s(body.interest, 60);
  const message = s(body.message, 2000);

  if (!name) {
    return NextResponse.json({ error: "กรุณากรอกชื่อ" }, { status: 400 });
  }
  if (!phone || phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json(
      { error: "กรุณากรอกเบอร์โทรให้ถูกต้อง" },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "ระบบยังไม่พร้อม" }, { status: 503 });
  }

  try {
    await query(
      `INSERT INTO partner_leads (name, company, email, phone, interest, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, company || null, email || null, phone, interest || null, message || null]
    );
  } catch (err) {
    console.error("partner lead insert failed:", err);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }

  // ส่งต่อให้ n8n เพื่อแจ้งทีมขาย (ถ้าตั้ง env ไว้) — ไม่ให้พังถ้ายิงไม่ผ่าน
  const hook = process.env.N8N_LEAD_WEBHOOK;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, phone, interest, message }),
      });
    } catch (err) {
      console.warn("lead webhook failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}

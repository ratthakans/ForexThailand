# Forex Thailand

เว็บข่าว Forex ภาษาไทย — ข่าวค่าเงิน ทองคำ และเศรษฐกิจ พร้อม dashboard รีวิวข่าวก่อนเผยแพร่และโพสขึ้น Facebook อัตโนมัติผ่าน n8n

สร้างด้วย Next.js (App Router) + TypeScript + Tailwind CSS + Neon Postgres (ผ่าน `pg` โดยตรง ไม่ใช้ ORM)

## เริ่มต้นใช้งาน

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. ตั้งค่า env — copy แล้วกรอกค่าจริง
cp .env.example .env

# 3. รัน dev server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Environment Variables

| ตัวแปร | จำเป็น | ใช้ทำอะไร |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | connection string ของ Neon Postgres (แบบ pooled) |
| `ADMIN_PASSWORD` | ✅ บน production | รหัสผ่านเข้าหน้า `/admin` (Basic Auth, username ใส่อะไรก็ได้) |
| `N8N_PUBLISH_WEBHOOK` | ไม่บังคับ | URL webhook ของ n8n — หลังกดอนุมัติ เว็บจะ POST `{ id }` ไปให้เพื่อโพส Facebook ถ้าว่างจะข้าม |
| `NEXT_PUBLIC_SITE_URL` | แนะนำ | URL จริงของเว็บ ใช้สร้าง absolute URL ให้ Open Graph (Facebook preview) |

## หน้าหลัก ๆ

- `/` — รายการข่าวที่เผยแพร่แล้ว (status `approved` / `posted`)
- `/article/[id]` — หน้าบทความเต็ม พร้อม Open Graph metadata สำหรับแชร์ Facebook
- `/admin` — dashboard รีวิวข่าว status `pending_review` กดอนุมัติ/ปฏิเสธได้ (ติดรหัสผ่าน)
- `POST /api/review` — API อนุมัติ/ปฏิเสธ body: `{ id, action: 'approve' | 'reject' }`

## Flow ของข่าว

```
n8n เขียนข่าวลง DB (pending_review)
  → ทีมงานกดอนุมัติที่ /admin
  → status เป็น approved + ยิง webhook ไป n8n
  → n8n โพส Facebook แล้วอัปเดต status เป็น posted
```

## Deploy ขึ้น Vercel

1. push โค้ดขึ้น GitHub แล้ว import โปรเจกต์ใน Vercel
2. ตั้ง Environment Variables ทั้ง 4 ตัวข้างบนใน Project Settings
3. Deploy — หน้าแรกและหน้าบทความ revalidate ทุก 60 วินาที

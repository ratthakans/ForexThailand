import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ป้องกันหน้า /admin และ /api/review ด้วย HTTP Basic Auth แบบเบา ๆ
 * - username: ใส่อะไรก็ได้ (เช็คเฉพาะรหัสผ่าน)
 * - password: ต้องตรงกับ env ADMIN_PASSWORD
 * - ถ้า ADMIN_PASSWORD ไม่ได้ตั้ง → ปล่อยผ่าน (สะดวกตอน dev) แต่ log เตือนไว้
 *
 * browser จะจำ credential ไว้เอง ทำให้ fetch จากหน้า /admin ไป /api/review
 * ติด Authorization header ให้อัตโนมัติ
 */
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.warn(
      "ADMIN_PASSWORD ยังไม่ได้ตั้ง — /admin เปิดโล่งอยู่ ตั้งค่าก่อนขึ้น production!"
    );
    return NextResponse.next();
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      // รูปแบบ "user:pass" — เอาเฉพาะส่วนหลัง colon แรก
      const given = decoded.slice(decoded.indexOf(":") + 1);
      if (given === password) {
        return NextResponse.next();
      }
    } catch {
      // base64 พัง → ตกไปตอบ 401 ด้านล่าง
    }
  }

  return new NextResponse("ต้องใส่รหัสผ่านเพื่อเข้าหน้ารีวิว", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Forex Thailand Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/review/:path*"],
};

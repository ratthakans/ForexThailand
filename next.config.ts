import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // อนุญาตโหลดรูปจากโดเมนภายนอกได้ทุกแหล่ง (ยืดหยุ่นสำหรับรูปข่าวจากหลายที่)
    // ใช้กับ next/image เท่านั้น — แท็ก <img> ปกติไม่ถูกจำกัดอยู่แล้ว
    remotePatterns: [
      // โดเมนที่ใช้บ่อย ระบุไว้ชัดเจนเพื่อความอ่านง่าย
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // catch-all: ทุก hostname ผ่าน https ('**' = ทุก subdomain ตั้งแต่ต้น)
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;

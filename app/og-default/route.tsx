import { ImageResponse } from "next/og";

export const runtime = "edge";

// ภาพ OG สำรอง 1200×630 (แบรนด์ Forex Thailand) สำหรับบทความที่ image_url เป็น null
// ใช้ตัวอักษรละติน เพราะฟอนต์ default ของ ImageResponse ไม่มีสระไทย
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "92px",
          background: "#0b0b0c",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 110,
            height: 8,
            background: "linear-gradient(90deg, #8a6912, #d2aa48, #a07c1c)",
            marginBottom: 44,
          }}
        />
        <span
          style={{
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#d2aa48",
          }}
        >
          Forex Thailand
        </span>
        <span
          style={{
            marginTop: 26,
            fontSize: 36,
            color: "#b89f6b",
            letterSpacing: 5,
          }}
        >
          CURRENCY · GOLD · ECONOMY NEWS
        </span>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

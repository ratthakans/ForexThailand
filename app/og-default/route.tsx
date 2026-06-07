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
          background: "#16181d",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 96,
            height: 8,
            background: "#0a9d8f",
            marginBottom: 44,
          }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 100, fontWeight: 700, letterSpacing: -2 }}>
            Forex Thailand
          </span>
          <span
            style={{
              display: "flex",
              marginLeft: 28,
              fontSize: 30,
              fontWeight: 700,
              background: "#0a9d8f",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: 10,
              letterSpacing: 3,
            }}
          >
            WEALTH
          </span>
        </div>
        <span
          style={{
            marginTop: 30,
            fontSize: 36,
            color: "rgba(255,255,255,0.6)",
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

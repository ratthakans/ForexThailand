import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// favicon "FXTH" — โมโนแกรม 2 บรรทัด ทองบนดำ
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0c",
          color: "#cda43f",
          fontFamily: "sans-serif",
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: -1 }}>FX</div>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: -1 }}>TH</div>
      </div>
    ),
    { ...size }
  );
}

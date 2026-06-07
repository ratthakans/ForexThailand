"use client";

import { useCallback, useState } from "react";

/**
 * โลโก้โบรกเกอร์ — ดึงอัตโนมัติจาก Clearbit Logo API ตามโดเมน
 * ถ้าโหลดไม่ได้ (ไม่มีโลโก้/พัง) จะ fallback เป็นโมโนแกรมตัวอักษรย่อ
 */
export function BrokerLogo({
  domain,
  name,
  size = 40,
}: {
  domain: string;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  const checkBroken = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth === 0) setFailed(true);
  }, []);

  const initials = name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (!domain || failed) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-md bg-ink font-display font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.34 }}
        aria-label={name}
      >
        {initials || "FX"}
      </span>
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={checkBroken}
        src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
        alt={`${name} logo`}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-1"
      />
    </span>
  );
}

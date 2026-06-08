"use client";

import { useCallback, useState } from "react";

/**
 * โลโก้โบรกเกอร์ — ดึงอัตโนมัติตามโดเมน โดยไล่จากแหล่งคมสุดก่อน
 *   1) Google faviconV2 128px (คม) → 2) DuckDuckGo (ครบทุกโดเมน) → 3) โมโนแกรม
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
  const sources = domain
    ? [
        `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`,
        `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      ]
    : [];

  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  const advance = useCallback(() => {
    setIdx((i) => {
      if (i + 1 < sources.length) return i + 1;
      setFailed(true);
      return i;
    });
  }, [sources.length]);

  const checkBroken = useCallback(
    (node: HTMLImageElement | null) => {
      if (node && node.complete && node.naturalWidth === 0) advance();
    },
    [advance]
  );

  const initials =
    name
      .replace(/[^A-Za-z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "FX";

  if (!domain || failed) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-md bg-ink font-display font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.34 }}
        aria-label={name}
      >
        {initials}
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
        key={idx}
        ref={checkBroken}
        src={sources[idx]}
        alt={`${name} logo`}
        width={size}
        height={size}
        loading="lazy"
        onError={advance}
        className="h-full w-full object-contain p-1"
      />
    </span>
  );
}

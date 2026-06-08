"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type NavItem = { label: string; href: string };

export function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const current = items.find((n) => isActive(n.href)) ?? items[0];

  return (
    <nav className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8">
        {/* มือถือ: แถบ + hamburger */}
        <div className="flex items-center justify-between py-2.5 md:hidden">
          <span className="text-sm font-bold text-ink">{current.label}</span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="เมนู"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-lg text-ink"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
        {open && (
          <div className="border-t border-line py-2 md:hidden">
            {items.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`block rounded px-3 py-2.5 text-sm font-semibold ${
                  isActive(n.href)
                    ? "bg-surface text-accent"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        )}

        {/* เดสก์ท็อป: แถบแนวนอน */}
        <div className="hidden items-center gap-1 md:flex">
          {items.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`shrink-0 border-b-2 px-3 py-3 text-[13px] font-semibold tracking-wide transition-colors ${
                isActive(n.href)
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

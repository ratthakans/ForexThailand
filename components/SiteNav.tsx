"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { label: string; href: string };

export function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 overflow-x-auto px-5 lg:px-8">
        {items.map((n) => {
          const active =
            n.href === "/"
              ? pathname === "/"
              : pathname === n.href || pathname.startsWith(`${n.href}/`);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`shrink-0 border-b-2 px-3 py-3 text-[13px] font-semibold tracking-wide transition-colors ${
                active
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

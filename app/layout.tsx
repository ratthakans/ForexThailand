import type { Metadata } from "next";
import { Anuphan, Noto_Sans_Thai } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { formatThaiDate } from "@/lib/format";
import { Logo } from "@/components/Logo";

const display = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
});

const sans = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Forex Thailand — ข่าวค่าเงิน ทองคำ และเศรษฐกิจ",
    template: "%s — Forex Thailand",
  },
  description:
    "ข่าวค่าเงิน ทองคำ และเศรษฐกิจ อัปเดตทันสถานการณ์ตลาดเงินไทยและต่างประเทศ",
};

const NAV = ["ค่าเงิน", "ทองคำ", "เศรษฐกิจ", "หุ้น", "คริปโต"];

function SiteHeader() {
  return (
    <header>
      {/* แถบบนสุด: วันที่ + แท็กไลน์ */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-1.5 text-[11px] tracking-wide text-ink-soft">
          <span>{formatThaiDate(new Date())}</span>
          <span className="hidden sm:block">
            ข่าวค่าเงิน · ทองคำ · เศรษฐกิจ
          </span>
        </div>
      </div>

      {/* มาสต์เฮด: โลโก้กลาง แบบสำนักข่าว */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-7 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-ink transition-opacity hover:opacity-80"
          >
            <Logo className="h-9 w-auto sm:h-11" />
            <span className="font-display text-3xl font-bold leading-none tracking-tight sm:text-[2.5rem]">
              Forex Thailand
            </span>
          </Link>
          <p className="mt-2.5 text-[13px] tracking-wide text-ink-soft">
            ข่าวค่าเงิน ทองคำ และเศรษฐกิจ
          </p>
        </div>
      </div>

      {/* แถบหมวด (sticky) — มีโลโก้เล็กโผล่เมื่อเลื่อนลง */}
      <nav className="sticky top-0 z-30 border-b border-ink/90 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-5">
          <Link
            href="/"
            className="mr-3 flex shrink-0 items-center gap-1.5 py-3 text-ink"
            aria-label="Forex Thailand หน้าแรก"
          >
            <Logo className="h-5 w-auto" />
          </Link>
          <div className="flex items-center gap-1 overflow-x-auto">
            <Link
              href="/"
              className="shrink-0 px-3 py-3 text-[13px] font-semibold text-ink hover:text-accent"
            >
              หน้าแรก
            </Link>
            {NAV.map((c) => (
              <span
                key={c}
                className="shrink-0 px-3 py-3 text-[13px] font-medium text-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-ink bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* แบรนด์ + คำอธิบาย */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-ink"
            >
              <Logo className="h-7 w-auto" />
              <span className="font-display text-xl font-bold tracking-tight">
                Forex Thailand
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              สำนักข่าวการเงิน รายงานความเคลื่อนไหวค่าเงิน ทองคำ
              และเศรษฐกิจไทยและต่างประเทศ อย่างกระชับ ทันสถานการณ์
            </p>
          </div>

          {/* หมวดข่าว */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
              หมวดข่าว
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {NAV.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          {/* เกี่ยวกับ */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
              เกี่ยวกับ
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              <li>
                <Link href="/" className="hover:text-accent">
                  หน้าแรก
                </Link>
              </li>
              <li>นโยบายข่าว</li>
              <li>ติดต่อกองบรรณาธิการ</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-[11px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Forex Thailand</span>
          <span>
            เนื้อหาเพื่อการศึกษาและติดตามข่าวสารเท่านั้น ไม่ใช่คำแนะนำการลงทุน
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

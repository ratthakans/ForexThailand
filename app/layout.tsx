import type { Metadata } from "next";
import { Noto_Serif_Thai, Sarabun } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { formatThaiDate } from "@/lib/format";

const serif = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif-thai",
  display: "swap",
});

const sans = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
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
      {/* แถบบนสุด */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2 text-[11px] tracking-wide text-ink-soft">
          <span>{formatThaiDate(new Date())}</span>
          <span className="hidden sm:block">
            ข่าวค่าเงิน · ทองคำ · เศรษฐกิจ
          </span>
        </div>
      </div>

      {/* มาสต์เฮด: wordmark serif แบบหนังสือพิมพ์ */}
      <div className="mx-auto max-w-5xl px-5 py-8 text-center sm:py-10">
        <Link
          href="/"
          className="inline-block transition-opacity hover:opacity-70"
        >
          <span className="font-serif text-[2.1rem] font-bold leading-none tracking-tight text-ink sm:text-[3rem]">
            Forex Thailand
          </span>
        </Link>
        <p className="mt-3 font-serif text-[13px] italic text-ink-soft sm:text-sm">
          ข่าวค่าเงิน ทองคำ และเศรษฐกิจ
        </p>
      </div>

      {/* แถบหมวด (sticky) เส้นคู่แบบหนังสือพิมพ์ */}
      <nav className="sticky top-0 z-30 border-y-[3px] border-double border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
          <Link
            href="/"
            className="shrink-0 py-2.5 font-serif text-sm font-bold tracking-tight text-ink"
          >
            Forex Thailand
          </Link>
          <div className="flex items-center gap-1 overflow-x-auto">
            <Link
              href="/"
              className="shrink-0 px-2.5 py-3 text-[12px] font-semibold uppercase tracking-wide text-ink hover:text-accent"
            >
              หน้าแรก
            </Link>
            {NAV.map((c) => (
              <span
                key={c}
                className="shrink-0 px-2.5 py-3 text-[12px] font-medium uppercase tracking-wide text-ink-soft"
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
    <footer className="mt-20 border-t-[3px] border-double border-ink">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.7fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-ink"
            >
              Forex Thailand
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              สำนักข่าวการเงิน รายงานความเคลื่อนไหวค่าเงิน ทองคำ
              และเศรษฐกิจไทยและต่างประเทศ อย่างกระชับ ทันสถานการณ์
              และเป็นกลาง
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-bold text-ink">หมวดข่าว</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {NAV.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-bold text-ink">เกี่ยวกับ</h3>
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
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

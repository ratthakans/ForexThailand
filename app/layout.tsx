import type { Metadata } from "next";
import { Anuphan, Newsreader, Noto_Sans_Thai } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import MarketTicker from "@/components/MarketTicker";
import { SiteNav, type NavItem } from "@/components/SiteNav";
import { JsonLd } from "@/components/JsonLd";
import { TOPICS } from "@/lib/topics";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.forexthailand.co";

// Anuphan = หัวข้อทั่วไป, Noto Sans Thai = เนื้อหา (เหมือนเดิม)
const display = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
});

const sans = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-thai",
  display: "swap",
});

// Newsreader = ใช้เฉพาะโลโก้ "Forex Thailand" เท่านั้น
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.forexthailand.co"
  ),
  title: {
    default: "Forex Thailand — ข่าวค่าเงิน ทองคำ และเศรษฐกิจ",
    template: "%s — Forex Thailand",
  },
  description:
    "สำนักข่าวการเงิน รายงานค่าเงิน ทองคำ และเศรษฐกิจ ทันทุกความเคลื่อนไหวตลาดเงินไทยและต่างประเทศ",
};

const NAV: NavItem[] = [
  { label: "หน้าแรก", href: "/" },
  { label: "บทวิเคราะห์", href: "/insight" },
  ...TOPICS.slice(0, 4).map((t) => ({
    label: t.label,
    href: `/topic/${t.slug}`,
  })),
  { label: "รีวิวโบรกเกอร์", href: "/brokers" },
];

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`font-logo text-xl font-bold tracking-tight sm:text-2xl ${
        light ? "text-white" : "text-ink"
      }`}
    >
      Forex Thailand
    </span>
  );
}

function SiteHeader() {
  return (
    <header>
      {/* แถบราคาวิ่ง (marquee) ตลาดเรียลไทม์ */}
      <div className="border-b border-white/10 bg-ink">
        <div className="mx-auto max-w-[1440px] px-2">
          <MarketTicker />
        </div>
      </div>

      {/* มาสต์เฮดดำ */}
      <div className="bg-ink">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4">
          <Link href="/" className="block">
            <Wordmark light />
            <span className="mt-1 block text-[11px] tracking-wide text-white/55">
              สำนักข่าวค่าเงิน ทองคำ และการลงทุน
            </span>
          </Link>
        </div>
      </div>

      {/* แถบเมนู (sticky) — active ตาม path ปัจจุบัน */}
      <SiteNav items={NAV} />
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-[1.7fr_1fr_1fr]">
          <div>
            <Wordmark light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              สำนักข่าวการเงิน รายงานความเคลื่อนไหวค่าเงิน ทองคำ
              และเศรษฐกิจไทยและต่างประเทศ อย่างกระชับ ทันสถานการณ์
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
              หมวดข่าว
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/insight" className="hover:text-white">
                  บทวิเคราะห์
                </Link>
              </li>
              {TOPICS.map((t) => (
                <li key={t.slug}>
                  <Link href={`/topic/${t.slug}`} className="hover:text-white">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
              เกี่ยวกับ
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/about" className="hover:text-white">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-white">
                  นโยบายกองบรรณาธิการ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  ติดต่อเรา
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-white">
                  ร่วมเป็นพาร์ทเนอร์
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
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
      className={`${display.variable} ${newsreader.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ink">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            name: "Forex Thailand",
            url: SITE_URL,
            logo: `${SITE_URL}/icon`,
            description:
              "สำนักข่าวการเงิน รายงานค่าเงิน ทองคำ และเศรษฐกิจ ทันทุกความเคลื่อนไหวตลาดเงินไทยและต่างประเทศ",
            inLanguage: "th-TH",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Forex Thailand",
            url: SITE_URL,
            inLanguage: "th-TH",
          }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

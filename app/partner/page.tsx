import type { Metadata } from "next";
import { PartnerForm } from "@/components/PartnerForm";

export const metadata: Metadata = {
  title: "ร่วมเป็นพาร์ทเนอร์",
  description:
    "ร่วมเป็นพาร์ทเนอร์ทางธุรกิจกับ Forex Thailand — โฆษณา สปอนเซอร์ และความร่วมมือด้านสื่อ ทีมขายพร้อมติดต่อกลับ",
  alternates: { canonical: "/partner" },
};

const BENEFITS = [
  "เข้าถึงกลุ่มผู้อ่านสายการเงิน เทรดเดอร์ และนักลงทุนไทย",
  "พื้นที่โฆษณา/สปอนเซอร์บนหน้าเว็บและคอนเทนต์",
  "ความร่วมมือด้านรีวิวและโปรโมชันโบรกเกอร์",
  "แพ็กเกจประชาสัมพันธ์ข่าวและแคมเปญร่วม",
];

export default function PartnerPage() {
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ซ้าย: ข้อมูล */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Business Partnership
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              ร่วมเป็นพาร์ทเนอร์กับ Forex Thailand
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              สนใจลงโฆษณา เป็นสปอนเซอร์ หรือร่วมมือด้านสื่อ?
              กรอกข้อมูลทิ้งไว้ ทีมขายของเราจะโทรกลับไปพูดคุยรายละเอียดกับคุณ
            </p>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm text-ink">
                  <span className="text-accent">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ขวา: ฟอร์ม */}
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
            <h2 className="font-display text-lg font-bold text-ink">
              ฝากข้อมูลให้ทีมขายติดต่อกลับ
            </h2>
            <p className="mt-1 text-[13px] text-ink-soft">
              กรอกเบอร์โทรไว้ เราจะโทรกลับโดยเร็วที่สุด
            </p>
            <div className="mt-5">
              <PartnerForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

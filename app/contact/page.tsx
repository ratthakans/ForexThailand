import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description:
    "ติดต่อกองบรรณาธิการ Forex Thailand — แจ้งข่าว เสนอความร่วมมือ หรือสอบถามข้อมูล",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          ติดต่อกองบรรณาธิการ
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
          มีข่าวอยากแจ้ง เสนอความร่วมมือ หรือสอบถามข้อมูลเพิ่มเติม ติดต่อเราได้ที่
        </p>
        <dl className="mt-6 divide-y divide-line rounded-xl border border-line bg-white">
          <div className="flex justify-between gap-4 px-5 py-4">
            <dt className="text-sm font-semibold text-ink-soft">อีเมล</dt>
            <dd className="text-sm font-semibold text-ink">
              editor@forexthailand.co
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-5 py-4">
            <dt className="text-sm font-semibold text-ink-soft">เว็บไซต์</dt>
            <dd className="text-sm font-semibold text-ink">
              www.forexthailand.co
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-5 py-4">
            <dt className="text-sm font-semibold text-ink-soft">เวลาทำการ</dt>
            <dd className="text-sm font-semibold text-ink">
              จันทร์–ศุกร์ 9:00–18:00 น.
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-[13px] leading-relaxed text-ink-soft">
          * กรุณาตรวจสอบและปรับอีเมล/ช่องทางติดต่อให้ตรงกับของจริงก่อนเผยแพร่
        </p>
      </div>
    </section>
  );
}

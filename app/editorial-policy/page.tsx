import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "นโยบายกองบรรณาธิการ",
  description:
    "นโยบายการนำเสนอข่าวและความโปร่งใสของ Forex Thailand — ความถูกต้อง แหล่งข้อมูล และ disclaimer การลงทุน",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  const points: { h: string; p: string }[] = [
    {
      h: "ความถูกต้องและการตรวจสอบ",
      p: "เรานำเสนอข้อมูลโดยอ้างอิงแหล่งข่าวและข้อมูลตลาดที่น่าเชื่อถือ และพยายามตรวจสอบความถูกต้องก่อนเผยแพร่ หากพบข้อผิดพลาดจะแก้ไขโดยเร็ว",
    },
    {
      h: "ความเป็นกลาง",
      p: "เรารายงานข่าวอย่างเป็นกลาง แยกระหว่างข้อเท็จจริงกับความเห็น/บทวิเคราะห์อย่างชัดเจน",
    },
    {
      h: "ไม่ใช่คำแนะนำการลงทุน",
      p: "เนื้อหาทั้งหมดมีไว้เพื่อการศึกษาและติดตามข่าวสารเท่านั้น ไม่ใช่คำแนะนำการลงทุน การเทรดมีความเสี่ยงสูง ผู้อ่านควรตัดสินใจด้วยตนเอง",
    },
    {
      h: "รีวิวโบรกเกอร์และโปรโมชัน",
      p: "ข้อมูลเปรียบเทียบโบรกเกอร์เป็นการรวบรวมเพื่อประกอบการพิจารณาเบื้องต้น อาจมีการเปลี่ยนแปลง โปรดตรวจสอบเงื่อนไขล่าสุดกับโบรกเกอร์โดยตรง",
    },
  ];
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          นโยบายกองบรรณาธิการ
        </h1>
        <div className="mt-8 space-y-6">
          {points.map((pt) => (
            <div key={pt.h}>
              <h2 className="font-display text-lg font-bold text-ink">{pt.h}</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                {pt.p}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

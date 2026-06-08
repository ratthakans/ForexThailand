import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description:
    "Forex Thailand สำนักข่าวการเงิน รายงานค่าเงิน ทองคำ และเศรษฐกิจ ทันทุกความเคลื่อนไหวตลาดเงินไทยและต่างประเทศ",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          เกี่ยวกับ Forex Thailand
        </h1>
        <div className="mt-6 space-y-5 text-[17px] leading-[1.9] text-ink">
          <p>
            <strong>Forex Thailand</strong> คือสำนักข่าวการเงินที่มุ่งรายงานความ
            เคลื่อนไหวของค่าเงิน ทองคำ หุ้น คริปโต และเศรษฐกิจ
            ทั้งในประเทศไทยและต่างประเทศ อย่างกระชับ รวดเร็ว และเข้าใจง่าย
          </p>
          <p>
            เราตั้งใจเป็นแหล่งข้อมูลที่ช่วยให้ผู้อ่าน — ตั้งแต่มือใหม่ไปจนถึง
            เทรดเดอร์ — ติดตามสถานการณ์ตลาดได้ทันท่วงที พร้อมเครื่องมือประกอบ เช่น
            อัตราแลกเปลี่ยนเรียลไทม์ ภาพรวมตลาด ปฏิทินเศรษฐกิจ
            และรีวิวเปรียบเทียบโบรกเกอร์
          </p>
          <p className="rounded-lg border-l-4 border-accent bg-surface px-4 py-3 text-[14px] text-ink-soft">
            ข้อมูลและบทความทั้งหมดมีไว้เพื่อการศึกษาและติดตามข่าวสารเท่านั้น
            ไม่ใช่คำแนะนำการลงทุน การเทรดมีความเสี่ยง
            ผู้ลงทุนควรศึกษาข้อมูลและตัดสินใจด้วยความรอบคอบ
          </p>
        </div>
      </div>
    </section>
  );
}

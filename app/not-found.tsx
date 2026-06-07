import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="font-serif text-6xl font-bold text-ink">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">
        ไม่พบบทความที่ต้องการ
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        บทความอาจถูกลบ ยังไม่ได้เผยแพร่ หรือลิงก์ไม่ถูกต้อง
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-accent underline-offset-2 hover:underline"
      >
        ← กลับสู่หน้าแรก
      </Link>
    </div>
  );
}

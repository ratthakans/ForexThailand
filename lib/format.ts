const TH_TZ = "Asia/Bangkok";

/** "7 มิถุนายน 2569" (พุทธศักราชตาม locale ไทย) */
export function formatThaiDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeZone: TH_TZ,
  }).format(date);
}

/** "7 มิถุนายน 2569 เวลา 14:30 น." สำหรับหน้าบทความ */
export function formatThaiDateTime(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  const datePart = new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeZone: TH_TZ,
  }).format(date);
  const timePart = new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TH_TZ,
  }).format(date);
  return `${datePart} · ${timePart} น.`;
}

/** ตัดข้อความเป็นความยาวสูงสุด (ใช้กับ meta description) */
export function truncate(text: string, max = 150): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

/** แยกเนื้อหาเป็นย่อหน้าจาก newline */
export function toParagraphs(body: string): string[] {
  const parts = body
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [body.trim()];
}

const CATEGORY_LABELS: Record<string, string> = {
  insight: "บทวิเคราะห์",
  breaking: "ข่าวด่วน",
  news_update: "อัปเดต",
  politics: "ต่างประเทศ",
  general: "ข่าวทั่วไป",
  review: "รีวิว",
  rumor: "ข่าวลือ",
  image: "ภาพข่าว",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? "ข่าวทั่วไป";
}

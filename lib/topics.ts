/** หมวดข่าวสำหรับเมนู + หน้า /topic/[slug] (กรองจากคีย์เวิร์ดในหัวข้อ/เนื้อหา) */
export type Topic = { slug: string; label: string; keywords: string[] };

export const TOPICS: Topic[] = [
  {
    slug: "currency",
    label: "ค่าเงิน",
    keywords: [
      "ค่าเงิน", "ดอลลาร์", "เงินบาท", "ยูโร", "เยน", "ปอนด์", "หยวน", "วอน",
      "EUR", "USD", "JPY", "GBP", "THB", "forex", "ฟอเร็กซ์", "NFP", "เฟด",
      "Fed", "ดอกเบี้ย", "ธนาคารกลาง",
    ],
  },
  {
    slug: "gold",
    label: "ทองคำ",
    keywords: ["ทองคำ", "ทอง", "gold", "XAU"],
  },
  {
    slug: "stocks",
    label: "หุ้น",
    keywords: ["หุ้น", "ดัชนี", "NASDAQ", "S&P", "ดาวโจนส์", "Dow", "ตลาดหุ้น", "SET"],
  },
  {
    slug: "crypto",
    label: "คริปโต",
    keywords: ["คริปโต", "บิตคอยน์", "bitcoin", "BTC", "ETH", "Ethereum", "คริปโทเคอร์เรนซี", "เหรียญ"],
  },
  {
    slug: "economy",
    label: "เศรษฐกิจ",
    keywords: ["เศรษฐกิจ", "GDP", "เงินเฟ้อ", "CPI", "การค้า", "ส่งออก", "จ้างงาน", "ตลาดแรงงาน"],
  },
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

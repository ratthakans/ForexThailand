import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.forexthailand.co";

/**
 * อนุญาตให้ทุก bot (รวม facebookexternalhit, Twitterbot, Googlebot) เข้าถึงได้
 * กันไว้ไม่ให้ index หน้า /admin และ /api เท่านั้น
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}

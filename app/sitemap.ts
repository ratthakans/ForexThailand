import type { MetadataRoute } from "next";
import { query } from "@/lib/db";
import { BROKERS } from "@/lib/brokers";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.forexthailand.co";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE}/brokers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/contact`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${SITE}/editorial-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...BROKERS.map((b) => ({
      url: `${SITE}/brokers/${b.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  if (!process.env.DATABASE_URL) return base;

  try {
    const { rows } = await query<{ id: number; created_at: Date }>(
      `SELECT id, created_at
         FROM articles
        WHERE coalesce(status, '') <> 'rejected'
          AND trim(coalesce(title_th, '')) <> ''
        ORDER BY created_at DESC
        LIMIT 1000`
    );
    return [
      ...base,
      ...rows.map((r) => ({
        url: `${SITE}/article/${r.id}`,
        lastModified: r.created_at,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ];
  } catch (err) {
    console.warn("sitemap failed:", err);
    return base;
  }
}

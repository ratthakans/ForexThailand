import { Pool, type QueryResult, type QueryResultRow } from "pg";

/**
 * Single shared pg Pool. In dev, Next.js hot-reloads modules which would
 * otherwise leak a new Pool per reload, so we cache it on globalThis.
 */
declare global {
  var _pgPool: Pool | undefined;
}

const pool =
  globalThis._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon ต้องใช้ SSL — rejectUnauthorized:false เพื่อยอมรับ cert ของ Neon
    ssl: { rejectUnauthorized: false },
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._pgPool = pool;
}

/** Reusable query helper. Use parameterized queries to avoid SQL injection. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params as unknown[] | undefined);
}

export default pool;

/** A row from the `articles` table. timestamptz comes back as a JS Date. */
export type Article = {
  id: number;
  source_url: string | null;
  title_th: string;
  body_th: string;
  img_type: string | null;
  image_url: string | null;
  image_credit: string | null;
  category: "breaking" | "image" | "general" | "news_update" | string;
  status: "pending_review" | "approved" | "posted" | "rejected" | string;
  fb_post_id: string | null;
  created_at: Date;
  /** คำโปรย 1 ประโยค — ใช้เป็น og:description (อาจ null) */
  hook: string | null;
  /** ผู้เขียน (อาจ null) */
  author: string | null;
};

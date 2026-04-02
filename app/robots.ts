/**
 * Next.js App Router serves this at /robots.txt (not public/robots.txt).
 * Use this file when URLs depend on env (e.g. sitemap origin). Static files in
 * public/ are fine too, but only one approach should own /robots.txt.
 */
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/helpers/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}

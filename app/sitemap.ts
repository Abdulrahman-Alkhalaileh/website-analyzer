/**
 * Next.js App Router serves this at /sitemap.xml (not public/sitemap.xml).
 * Keeps the canonical site URL in sync with NEXT_PUBLIC_SITE_URL.
 */
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/helpers/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/auth/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/auth/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

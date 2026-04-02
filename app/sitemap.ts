/**
 * Next.js App Router serves this at /sitemap.xml (not public/sitemap.xml).
 * Keeps the canonical site URL in sync with NEXT_PUBLIC_SITE_URL.
 */
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/helpers/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

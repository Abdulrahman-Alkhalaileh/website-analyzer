/**
 * External documentation URLs used in the UI.
 * Prefer Chrome Developers “docs/lighthouse” and web.dev “/articles/” paths;
 * they are stable; do not guess per-audit slugs on web.dev (many 404).
 */

export const LINKS = {
  /** Lighthouse introduction (report structure, audits, screenshots in context) */
  lighthouseOverview: "https://developer.chrome.com/docs/lighthouse/overview/",
  /** Lighthouse landing page (all categories) */
  lighthouseIndex: "https://developer.chrome.com/docs/lighthouse/",
  /** Performance category hub (metrics, opportunities, filmstrip lives in the report) */
  lighthousePerformance: "https://developer.chrome.com/docs/lighthouse/performance/",
  /** Lighthouse SEO category (meta tags, crawlability, structured data, etc.) */
  lighthouseSeo: "https://developer.chrome.com/docs/lighthouse/seo/",
  lighthouseScoring:
    "https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/",
  chromeUxReport: "https://developer.chrome.com/docs/crux/about/",
  /** Canonical Web Vitals article on web.dev */
  webVitals: "https://web.dev/articles/vitals",
  pageSpeedDocs: "https://developers.google.com/speed/docs/insights/v5/about",
} as const;

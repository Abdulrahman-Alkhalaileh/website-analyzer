/** Public site URL, no trailing slash. Set in production (e.g. Vercel: NEXT_PUBLIC_SITE_URL). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export const SITE_NAME = "Instant Website Audit";

/** Meta tags, Open Graph, JSON-LD (longer, keyword-rich). */
export const SITE_DESCRIPTION =
  "Run a free website performance audit powered by Google PageSpeed Insights. Get Lighthouse scores for performance, SEO, accessibility, and best practices, plus Core Web Vitals, filmstrip previews, and plain-language fixes you can act on.";

/**
 * Short line under the on-page h1—same voice as the hero, not a second wall of text.
 */
export const SITE_PAGE_INTRO =
  "We run PageSpeed Insights for you and turn the report into a clear dashboard: scores, previews, vitals context, and fixes you can actually use.";

export const AUTH_LOGIN_DESCRIPTION =
  "Sign in to save PageSpeed and Lighthouse audits to your dashboard and reopen them anytime.";

export const AUTH_SIGNUP_DESCRIPTION =
  "Create a free account to save website audits to your dashboard and track performance over time.";

/** Logged-in area: keep out of sitemap; allow follow for internal links only. */
export const DASHBOARD_PAGE_DESCRIPTION =
  "Your saved PageSpeed and Lighthouse audits: performance charts, sites grouped by domain, and links to reopen full reports.";

export const AUTH_LOGIN_KEYWORDS: string[] = [
  "sign in",
  "login",
  "save audits",
  "PageSpeed dashboard",
  "Lighthouse saved reports",
  SITE_NAME,
];

export const AUTH_SIGNUP_KEYWORDS: string[] = [
  "sign up",
  "create account",
  "free account",
  "save website audits",
  "performance monitoring",
  SITE_NAME,
];

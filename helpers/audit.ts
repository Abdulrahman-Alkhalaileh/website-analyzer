import type {
  LighthouseAudit,
  LighthouseResult,
  PageSpeedApiResponse,
} from "@/helpers/types/pagespeed";
import { normalizeImageDataUrl } from "@/helpers/image";
import {
  extractEntities,
  extractFieldMetrics,
  extractFilmstripFrames,
  extractFinalScreenshotSrc,
  extractOpportunities,
  extractResourceByType,
  extractThirdPartyRows,
  type EntityRow,
  type FieldMetricRow,
  type FilmstripFrame,
  type OpportunityExtract,
  type ResourceTypeRow,
  type ThirdPartyRow,
} from "@/helpers/lighthouse-extract";

export type ScoreBand = "good" | "medium" | "poor";

export interface CategoryScores {
  performance: number | null;
  seo: number | null;
  accessibility: number | null;
  bestPractices: number | null;
}

export interface MetricDisplay {
  id: string;
  label: string;
  barPercent: number;
  displayValue: string;
  numericValue: number | null;
}

export interface IssueItem {
  id: string;
  title: string;
  friendly: string;
  /** Lighthouse audit score 0–1 when present (lower = worse) */
  score: number | null;
}

export type LabStrategy = "mobile" | "desktop";

export interface RunInfo {
  fetchTime: string;
  lighthouseVersion: string;
  analysisDurationMs: number;
  benchmarkIndex?: number;
  formFactor?: string;
  /** Normalized from Lighthouse config — matches PageSpeed `strategy` for this run */
  labStrategy: LabStrategy;
  channel?: string;
}

export interface NetworkHighlight {
  label: string;
  value: string;
}

export interface AuditDashboard {
  categoryScores: CategoryScores;
  /** LCP, INP, CLS, FCP (lab) */
  coreWebVitals: MetricDisplay[];
  /** TBT, Speed Index, TTI */
  labMetrics: MetricDisplay[];
  screenshotData: string | null;
  /** Progressive load screenshots (Lighthouse filmstrip) */
  filmstripFrames: FilmstripFrame[];
  /** Viewport capture at end of trace */
  finalScreenshotSrc: string | null;
  issues: IssueItem[];
  finalUrl: string | null;
  runInfo: RunInfo;
  /** Chrome UX Report — URL-level */
  fieldDataUrl: FieldMetricRow[];
  /** Chrome UX Report — origin-level */
  fieldDataOrigin: FieldMetricRow[];
  fieldOverallUrl?: string;
  fieldOverallOrigin?: string;
  opportunities: OpportunityExtract[];
  resourceByType: ResourceTypeRow[];
  thirdParties: ThirdPartyRow[];
  entities: EntityRow[];
  runWarnings: string[];
  networkHighlights: NetworkHighlight[];
  /** Failing audits that belong to Lighthouse’s SEO category only */
  seoIssues: IssueItem[];
}

export type {
  EntityRow,
  FieldMetricRow,
  FilmstripFrame,
  OpportunityExtract,
  ResourceTypeRow,
  ThirdPartyRow,
} from "@/helpers/lighthouse-extract";

const FRIENDLY_AUDIT: Record<string, string> = {
  "unused-javascript":
    "Remove unused JavaScript so the browser downloads less code.",
  "unused-css-rules": "Drop unused CSS to shrink stylesheets and speed paint.",
  "render-blocking-resources":
    "Defer or inline critical CSS so the page paints sooner.",
  "uses-optimized-images":
    "Compress and resize images to improve load speed.",
  "uses-responsive-images":
    "Serve appropriately sized images for each screen.",
  "offscreen-images": "Lazy-load images that are below the fold.",
  "uses-text-compression": "Enable compression (gzip/Brotli) on the server.",
  "uses-long-cache-ttl": "Set longer cache lifetimes for static assets.",
  "total-byte-weight": "Reduce overall page weight for faster loads.",
  "dom-size": "Simplify the DOM to improve rendering and memory use.",
  "bootup-time": "Cut JavaScript execution time on the main thread.",
  "mainthread-work-breakdown": "Reduce main-thread work during load.",
  "third-party-summary": "Audit third-party scripts that add latency.",
  "legacy-javascript": "Avoid shipping legacy JavaScript to modern browsers.",
  "uses-rel-preconnect": "Use preconnect for critical origins.",
  "uses-rel-preload": "Preload key fonts and hero assets.",
  "font-display": "Use font-display so text stays visible while fonts load.",
  redirects: "Remove unnecessary redirects on critical paths.",
  "uses-http2": "Serve assets over HTTP/2 or HTTP/3 where possible.",
  "document-latency-insight": "Improve server response time (TTFB).",
  "cache-insight": "Tune caching so repeat visits stay fast.",
  "image-delivery-insight": "Optimize image formats and delivery.",
  "lcp-discovery-insight": "Help the browser discover the LCP image earlier.",
  "lcp-breakdown-insight": "Reduce delays before the largest paint.",
  "cls-culprits-insight": "Fix layout shifts that hurt visual stability.",
  "network-dependency-tree-insight": "Trim the critical request chain.",
  "render-blocking-insight": "Eliminate render-blocking requests.",
  "duplicated-javascript-insight": "Deduplicate shared JavaScript bundles.",
  "forced-reflow-insight": "Avoid layout thrashing during interactions.",
  "inp-breakdown-insight": "Improve responsiveness to user input.",
  "meta-description": "Add a clear meta description for search snippets.",
  "document-title": "Use a concise, unique title for each page.",
  "link-text": "Make link text descriptive for users and crawlers.",
  "crawlable-anchors": "Ensure important links are crawlable.",
  "is-crawlable": "Don’t block search engines from indexing this page.",
  "robots-txt": "Keep robots.txt valid and intentional.",
  hreflang: "Use hreflang when you target multiple locales.",
  canonical: "Set a canonical URL to avoid duplicate content issues.",
  "structured-data": "Add structured data where it helps rich results.",
  "tap-targets": "Increase tap target size on small screens.",
  "color-contrast": "Improve text/background contrast for readability.",
  "image-alt": "Add helpful alt text to meaningful images.",
  "label-content-name-mismatch": "Match visible labels to accessible names.",
};

export function validateHttpUrl(
  input: string
): { ok: true } | { ok: false; message: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, message: "Enter a URL to analyze." };
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return { ok: false, message: "That doesn’t look like a valid URL." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, message: "Only http and https URLs are supported." };
  }
  return { ok: true };
}

export function scoreToBand(score: number | null): ScoreBand {
  if (score == null) return "medium";
  const n = score * 100;
  if (n >= 90) return "good";
  if (n >= 50) return "medium";
  return "poor";
}

export function scoreToBarPercent(score: number | null): number {
  if (score == null) return 0;
  return Math.max(0, Math.min(100, Math.round(score * 100)));
}

/**
 * Lighthouse category scores are 0–1. Returns a rounded 0–100 average for storage or summaries.
 */
export function averageCategoryScoresAsPercent(
  categoryScores: CategoryScores
): number | null {
  const vals = Object.values(categoryScores).filter(
    (s): s is number => s != null && Number.isFinite(s)
  );
  if (vals.length === 0) return null;
  const avg = vals.reduce((acc, curr) => acc + curr, 0) / vals.length;
  return Math.max(0, Math.min(100, Math.round(avg * 100)));
}

function getAudit(
  audits: Record<string, LighthouseAudit> | undefined,
  id: string
): LighthouseAudit | undefined {
  return audits?.[id];
}

function metricFromAudit(
  audits: Record<string, LighthouseAudit> | undefined,
  id: string,
  label: string
): MetricDisplay | null {
  const a = getAudit(audits, id);
  if (!a) return null;
  const score = a.score;
  const barPercent =
    score != null ? scoreToBarPercent(score) : a.numericValue != null ? 72 : 40;
  return {
    id,
    label,
    barPercent,
    displayValue: a.displayValue ?? "—",
    numericValue: a.numericValue ?? null,
  };
}

function buildCoreWebVitals(
  audits: Record<string, LighthouseAudit>
): MetricDisplay[] {
  const out: MetricDisplay[] = [];
  const push = (id: string, label: string) => {
    const m = metricFromAudit(audits, id, label);
    if (m) out.push(m);
  };
  push("largest-contentful-paint", "LCP");
  const inp =
    metricFromAudit(audits, "interaction-to-next-paint", "INP") ??
    metricFromAudit(audits, "experimental-interaction-to-next-paint", "INP");
  if (inp) out.push(inp);
  push("cumulative-layout-shift", "CLS");
  push("first-contentful-paint", "FCP");
  return out;
}

function buildLabMetrics(audits: Record<string, LighthouseAudit>): MetricDisplay[] {
  const out: MetricDisplay[] = [];
  const push = (id: string, label: string) => {
    const m = metricFromAudit(audits, id, label);
    if (m) out.push(m);
  };
  push("total-blocking-time", "TBT");
  push("speed-index", "Speed Index");
  push("interactive", "Time to Interactive");
  return out;
}

const METRIC_AUDIT_IDS = new Set([
  "first-contentful-paint",
  "largest-contentful-paint",
  "speed-index",
  "interactive",
  "total-blocking-time",
  "cumulative-layout-shift",
  "max-potential-fid",
  "interaction-to-next-paint",
  "experimental-interaction-to-next-paint",
]);

function auditToIssueItem(audit: LighthouseAudit): IssueItem {
  return {
    id: audit.id,
    title: audit.title,
    score: audit.score,
    friendly:
      FRIENDLY_AUDIT[audit.id] ??
      (audit.title
        ? `${audit.title} — worth fixing for a faster, clearer experience.`
        : "Improve this audit to lift your score."),
  };
}

function buildIssues(audits: Record<string, LighthouseAudit>): IssueItem[] {
  const candidates: LighthouseAudit[] = [];
  for (const audit of Object.values(audits)) {
    if (METRIC_AUDIT_IDS.has(audit.id)) continue;
    if (audit.score === null || audit.score >= 1) continue;
    if (audit.scoreDisplayMode === "notApplicable") continue;
    if (audit.scoreDisplayMode === "manual") continue;
    if (audit.scoreDisplayMode === "informative") continue;
    candidates.push(audit);
  }
  candidates.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
  return candidates.slice(0, 10).map(auditToIssueItem);
}

/**
 * Failing audits scoped to one Lighthouse category (e.g. `seo`), using that
 * category’s auditRefs so SEO/accessibility items aren’t dropped when the
 * global “top 10” list is performance-heavy.
 */
function buildIssuesForCategory(
  lr: LighthouseResult,
  categoryId: string
): IssueItem[] {
  const refs = lr.categories[categoryId]?.auditRefs;
  if (!refs?.length) return [];
  const refIds = new Set(refs.map((r) => r.id));
  const candidates: LighthouseAudit[] = [];
  for (const audit of Object.values(lr.audits)) {
    if (!refIds.has(audit.id)) continue;
    if (METRIC_AUDIT_IDS.has(audit.id)) continue;
    if (audit.score === null || audit.score >= 1) continue;
    if (audit.scoreDisplayMode === "notApplicable") continue;
    if (audit.scoreDisplayMode === "manual") continue;
    if (audit.scoreDisplayMode === "informative") continue;
    candidates.push(audit);
  }
  candidates.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
  return candidates.map(auditToIssueItem);
}

const NETWORK_AUDIT_LABELS: [string, string][] = [
  ["server-response-time", "Server response (TTFB)"],
  ["network-rtt", "Network RTT"],
  ["redirects", "Redirects"],
  ["total-byte-weight", "Total transfer size"],
  ["dom-size", "DOM elements"],
  ["bootup-time", "JavaScript boot-up time"],
];

function inferLabStrategy(lr: {
  configSettings?: {
    formFactor?: string | null;
    emulatedFormFactor?: string | null;
  };
}): LabStrategy {
  const raw = (
    lr.configSettings?.formFactor ??
    lr.configSettings?.emulatedFormFactor ??
    "mobile"
  )
    .toString()
    .toLowerCase();
  return raw === "desktop" ? "desktop" : "mobile";
}

function buildNetworkHighlights(
  audits: Record<string, LighthouseAudit>
): NetworkHighlight[] {
  const out: NetworkHighlight[] = [];
  for (const [id, label] of NETWORK_AUDIT_LABELS) {
    const a = audits[id];
    if (!a?.displayValue) continue;
    out.push({ label, value: a.displayValue });
  }
  return out;
}

export function buildAuditDashboard(
  data: PageSpeedApiResponse | null
): AuditDashboard | null {
  if (!data?.lighthouseResult) return null;
  const { lighthouseResult: lr } = data;
  const { audits, categories } = lr;

  const categoryScores: CategoryScores = {
    performance: categories.performance?.score ?? null,
    seo: categories.seo?.score ?? null,
    accessibility: categories.accessibility?.score ?? null,
    bestPractices: categories["best-practices"]?.score ?? null,
  };

  const coreWebVitals = buildCoreWebVitals(audits);
  const labMetrics = buildLabMetrics(audits);

  const raw = lr.fullPageScreenshot?.screenshot?.data;
  const screenshotData = raw ? normalizeImageDataUrl(raw) : null;
  const filmstripFrames = extractFilmstripFrames(audits);
  const finalScreenshotSrc = extractFinalScreenshotSrc(audits);

  const issues = buildIssues(audits);
  const seoIssues = buildIssuesForCategory(lr, "seo");

  const labStrategy = inferLabStrategy(lr);

  const runInfo: RunInfo = {
    fetchTime: lr.fetchTime,
    lighthouseVersion: lr.lighthouseVersion,
    analysisDurationMs: lr.timing?.total ?? 0,
    benchmarkIndex: lr.environment?.benchmarkIndex,
    formFactor:
      lr.configSettings?.formFactor ?? lr.configSettings?.emulatedFormFactor,
    labStrategy,
    channel: typeof lr.configSettings?.channel === "string"
      ? lr.configSettings.channel
      : undefined,
  };

  const fieldDataUrl = extractFieldMetrics(data.loadingExperience, "url");
  const fieldDataOrigin = extractFieldMetrics(
    data.originLoadingExperience,
    "origin"
  );

  const opportunities = extractOpportunities(audits, 12);
  const resourceByType = extractResourceByType(audits);
  const thirdParties = extractThirdPartyRows(audits, 12);
  const entities = extractEntities(lr.entities, 12);
  const runWarnings = lr.runWarnings ?? [];
  const networkHighlights = buildNetworkHighlights(audits);

  return {
    categoryScores,
    coreWebVitals,
    labMetrics,
    screenshotData,
    filmstripFrames,
    finalScreenshotSrc,
    issues,
    finalUrl: lr.finalUrl ?? lr.requestedUrl ?? null,
    runInfo,
    fieldDataUrl,
    fieldDataOrigin,
    fieldOverallUrl: data.loadingExperience?.overall_category,
    fieldOverallOrigin: data.originLoadingExperience?.overall_category,
    opportunities,
    resourceByType,
    thirdParties,
    entities,
    runWarnings,
    networkHighlights,
    seoIssues,
  };
}

/**
 * Parses JSON stored in `reports.data` (serialized {@link AuditDashboard} from a prior save).
 * Normalizes missing arrays for older rows. Returns null if the shape is not usable.
 */
export function parseSavedAuditDashboard(input: unknown): AuditDashboard | null {
  if (input == null || typeof input !== "object") return null;
  const d = input as Partial<AuditDashboard>;
  if (!d.categoryScores || typeof d.categoryScores !== "object") return null;
  if (!d.runInfo || typeof d.runInfo !== "object") return null;
  const ls = d.runInfo.labStrategy;
  if (ls !== "mobile" && ls !== "desktop") return null;
  if (!Array.isArray(d.issues)) return null;

  return {
    categoryScores: d.categoryScores,
    coreWebVitals: Array.isArray(d.coreWebVitals) ? d.coreWebVitals : [],
    labMetrics: Array.isArray(d.labMetrics) ? d.labMetrics : [],
    screenshotData:
      typeof d.screenshotData === "string" || d.screenshotData === null
        ? d.screenshotData ?? null
        : null,
    filmstripFrames: Array.isArray(d.filmstripFrames) ? d.filmstripFrames : [],
    finalScreenshotSrc:
      typeof d.finalScreenshotSrc === "string" || d.finalScreenshotSrc === null
        ? d.finalScreenshotSrc ?? null
        : null,
    issues: d.issues,
    finalUrl: typeof d.finalUrl === "string" || d.finalUrl === null ? d.finalUrl ?? null : null,
    runInfo: d.runInfo,
    fieldDataUrl: Array.isArray(d.fieldDataUrl) ? d.fieldDataUrl : [],
    fieldDataOrigin: Array.isArray(d.fieldDataOrigin) ? d.fieldDataOrigin : [],
    fieldOverallUrl:
      typeof d.fieldOverallUrl === "string" ? d.fieldOverallUrl : undefined,
    fieldOverallOrigin:
      typeof d.fieldOverallOrigin === "string" ? d.fieldOverallOrigin : undefined,
    opportunities: Array.isArray(d.opportunities) ? d.opportunities : [],
    resourceByType: Array.isArray(d.resourceByType) ? d.resourceByType : [],
    thirdParties: Array.isArray(d.thirdParties) ? d.thirdParties : [],
    entities: Array.isArray(d.entities) ? d.entities : [],
    runWarnings: Array.isArray(d.runWarnings) ? d.runWarnings : [],
    networkHighlights: Array.isArray(d.networkHighlights) ? d.networkHighlights : [],
    seoIssues: Array.isArray(d.seoIssues) ? d.seoIssues : [],
  };
}

/** Parse a JSON string from the DB into an {@link AuditDashboard}, or null. */
export function parseSavedAuditDashboardJson(json: string | null | undefined): AuditDashboard | null {
  if (json == null || json === "") return null;
  try {
    return parseSavedAuditDashboard(JSON.parse(json) as unknown);
  } catch {
    return null;
  }
}

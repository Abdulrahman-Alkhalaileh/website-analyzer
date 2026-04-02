/**
 * Types for the Google PageSpeed Insights API v5 (`pagespeedonline#runPagespeed`) response body.
 * Structured in layers: API envelope → optional CrUX → Lighthouse report.
 */

// --- API root ----------------------------------------------------------------

export type PageSpeedCaptchaResult = "CAPTCHA_NOT_NEEDED" | string;

export interface PageSpeedApiResponse {
  captchaResult: PageSpeedCaptchaResult;
  kind: "pagespeedonline#result";
  /** Canonical URL analyzed */
  id: string;
  loadingExperience?: LoadingExperience;
  /** CrUX for the origin (when available) */
  originLoadingExperience?: LoadingExperience;
  lighthouseResult?: LighthouseResult;
  /** ISO-like timestamp when the analysis completed */
  analysisUTCTimestamp?: string;
}

// --- CrUX / loading experience (optional; shape varies by URL and API version) ---

/** Distribution bucket in CrUX metrics */
export interface CrUXDistribution {
  min: number;
  max?: number;
  proportion: number;
}

export interface CrUXMetric {
  percentile?: number;
  distributions?: CrUXDistribution[];
  category?: string;
}

/**
 * Field-level experience metrics (e.g. FIRST_CONTENTFUL_PAINT_MS) when returned by the API.
 * The sample response only included `initial_url`; extra fields are optional for real responses.
 */
export interface LoadingExperience {
  initial_url?: string;
  id?: string;
  metrics?: Record<string, CrUXMetric>;
  overall_category?: string;
}

// --- Lighthouse envelope -----------------------------------------------------

export interface LighthouseEnvironment {
  networkUserAgent: string;
  hostUserAgent: string;
  benchmarkIndex?: number;
}

export interface LighthouseConfigSettings {
  emulatedFormFactor?: string;
  formFactor?: string;
  locale?: string;
  onlyCategories?: string[] | null;
  channel?: string;
  [key: string]: unknown;
}

export interface LighthouseTiming {
  total: number;
}

export interface LighthouseRuntimeError {
  code?: string;
  message: string;
}

export interface LighthouseStackPack {
  id: string;
  title: string;
  iconDataURL: string;
}

export interface LighthouseCategory {
  id: string;
  title: string;
  score: number | null;
  auditRefs: LighthouseAuditRef[];
}

export interface LighthouseAuditRef {
  id: string;
  weight: number;
  group?: string;
  acronym?: string;
}

export interface LighthouseCategoryGroup {
  title: string;
  description?: string;
}

export interface LighthouseI18n {
  rendererFormattedStrings: Record<string, string>;
}

export interface LighthouseEntity {
  name: string;
  isFirstParty?: boolean;
  isUnrecognized?: boolean;
  origins?: string[];
  category?: string;
}

export interface FullPageScreenshot {
  screenshot: {
    data: string;
    width: number;
    height: number;
  };
  /** Bounding boxes keyed by Lighthouse node id */
  nodes: Record<string, FullPageScreenshotNode>;
}

export interface FullPageScreenshotNode {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
  id?: string;
}

export interface LighthouseResult {
  requestedUrl: string;
  finalUrl: string;
  mainDocumentUrl?: string;
  finalDisplayedUrl?: string;
  lighthouseVersion: string;
  userAgent: string;
  fetchTime: string;
  environment: LighthouseEnvironment;
  runWarnings?: string[];
  configSettings: LighthouseConfigSettings;
  audits: Record<string, LighthouseAudit>;
  categories: Record<string, LighthouseCategory>;
  categoryGroups: Record<string, LighthouseCategoryGroup>;
  timing: LighthouseTiming;
  i18n: LighthouseI18n;
  entities?: LighthouseEntity[];
  fullPageScreenshot?: FullPageScreenshot;
  runtimeError?: LighthouseRuntimeError;
  stackPacks?: LighthouseStackPack[];
}

// --- Audits ------------------------------------------------------------------

export type LighthouseScoreDisplayMode =
  | "numeric"
  | "binary"
  | "manual"
  | "informative"
  | "notApplicable"
  | "error"
  | string;

/** Savings keyed by metric id (LCP, FCP, …) */
export type LighthouseMetricSavings = Record<string, number>;

export interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: LighthouseScoreDisplayMode;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
  details?: LighthouseAuditDetails;
  warnings?: string[];
  metricSavings?: LighthouseMetricSavings;
}

// --- Audit `details` (discriminated by `type`) -------------------------------

export type LighthouseAuditDetails =
  | LighthouseDetailsList
  | LighthouseDetailsTable
  | LighthouseDetailsDebugData
  | LighthouseDetailsOpportunity
  | LighthouseDetailsTreemapData
  | LighthouseDetailsScreenshot
  | LighthouseDetailsChecklist
  | LighthouseDetailsFilmstrip;

export interface LighthouseDetailsList {
  type: "list";
  items: LighthouseDetailItem[];
}

export interface LighthouseTableHeading {
  key?: string;
  keyPath?: string;
  label?: string;
  valueType?: string;
  subItemsHeading?: { key: string; valueType?: string };
  granularity?: number;
}

export interface LighthouseDetailsTable {
  type: "table";
  headings: LighthouseTableHeading[];
  items: LighthouseDetailItem[];
}

export interface LighthouseDetailsDebugData {
  type: "debugdata";
  items: LighthouseDetailItem[];
}

export interface LighthouseDetailsOpportunity {
  type: "opportunity";
  headings: LighthouseTableHeading[];
  items: LighthouseDetailItem[];
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
  sortedBy?: string[];
  debugData?: LighthouseNestedDebugData;
}

export interface LighthouseNestedDebugData {
  type: "debugdata";
  [key: string]: unknown;
}

export interface LighthouseTreemapNode {
  name?: string;
  resourceBytes?: number;
  unusedBytes?: number;
  children?: LighthouseTreemapNode[];
}

export interface LighthouseDetailsTreemapData {
  type: "treemap-data";
  nodes: LighthouseTreemapNode[];
}

export interface LighthouseDetailsScreenshot {
  type: "screenshot";
  data: string;
  timestamp?: number;
  timing?: number;
}

export interface LighthouseDetailsChecklist {
  type: "checklist";
  items: LighthouseDetailItem[];
  debugData?: LighthouseNestedDebugData;
}

export interface LighthouseFilmstripItem {
  timing: number;
  timestamp: number;
  data: string;
}

export interface LighthouseDetailsFilmstrip {
  type: "filmstrip";
  scale: number;
  items: LighthouseFilmstripItem[];
}

/** Row / list cell payloads differ per audit; keep extensible */
export type LighthouseDetailItem = Record<string, unknown>;

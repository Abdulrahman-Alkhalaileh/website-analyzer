import type {
  LighthouseAudit,
  LighthouseDetailItem,
  LoadingExperience,
} from "@/helpers/types/pagespeed";
import { normalizeImageDataUrl } from "@/helpers/utils/image";

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n < 10 && i > 0 ? n.toFixed(1) : Math.round(n)} ${u[i]}`;
}

export function formatMs(ms: number): string {
  if (!Number.isFinite(ms)) return "—";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function getTableItems(audit: LighthouseAudit | undefined): LighthouseDetailItem[] {
  const d = audit?.details;
  if (d?.type === "table" && Array.isArray(d.items)) return d.items;
  return [];
}

export function getListItems(audit: LighthouseAudit | undefined): LighthouseDetailItem[] {
  const d = audit?.details;
  if (d?.type === "list" && Array.isArray(d.items)) return d.items;
  return [];
}

const CRUX_LABEL: Record<string, string> = {
  CUMULATIVE_LAYOUT_SHIFT_SCORE: "CLS (field)",
  FIRST_CONTENTFUL_PAINT_MS: "FCP (field)",
  INTERACTION_TO_NEXT_PAINT: "INP (field)",
  LARGEST_CONTENTFUL_PAINT_MS: "LCP (field)",
  EXPERIMENTAL_INTERACTION_TO_NEXT_PAINT: "INP (field)",
};

export interface FieldMetricRow {
  key: string;
  label: string;
  percentile?: number;
  category?: string;
}

export function extractFieldMetrics(
  le: LoadingExperience | undefined,
  prefix: string
): FieldMetricRow[] {
  if (!le?.metrics) return [];
  const rows: FieldMetricRow[] = [];
  for (const [key, m] of Object.entries(le.metrics)) {
    rows.push({
      key: `${prefix}:${key}`,
      label: CRUX_LABEL[key] ?? key.replace(/_/g, " "),
      percentile: m.percentile,
      category: m.category,
    });
  }
  return rows;
}

export interface OpportunityExtract {
  id: string;
  title: string;
  savingsBytes: number;
  savingsMs: number;
  displayValue?: string;
}

export function extractOpportunities(
  audits: Record<string, LighthouseAudit>,
  limit = 10
): OpportunityExtract[] {
  const out: OpportunityExtract[] = [];
  for (const audit of Object.values(audits)) {
    const d = audit.details;
    if (d?.type !== "opportunity") continue;
    if (audit.score === 1) continue;
    const savingsBytes = d.overallSavingsBytes ?? 0;
    const savingsMs = d.overallSavingsMs ?? 0;
    out.push({
      id: audit.id,
      title: audit.title,
      savingsBytes,
      savingsMs,
      displayValue: audit.displayValue,
    });
  }
  out.sort(
    (a, b) =>
      b.savingsBytes +
      b.savingsMs * 50 -
      (a.savingsBytes + a.savingsMs * 50)
  );
  return out.slice(0, limit);
}

export interface ResourceTypeRow {
  id: string;
  label: string;
  requestCount: number;
  transferBytes: number;
}

export function extractResourceByType(
  audits: Record<string, LighthouseAudit>
): ResourceTypeRow[] {
  const audit = audits["resource-summary"];
  const items = getTableItems(audit);
  return items.map((item, i) => ({
    id: `res-${i}`,
    label: String(item.label ?? item.resourceType ?? "Resource"),
    requestCount: Number(item.requestCount ?? 0),
    transferBytes: Number(item.transferSize ?? item.size ?? 0),
  }));
}

export interface ThirdPartyRow {
  id: string;
  name: string;
  blockingTimeMs: number;
  transferSize: number;
}

function thirdPartyName(item: LighthouseDetailItem): string {
  const e = item.entity;
  if (typeof e === "string") return e;
  if (e && typeof e === "object" && "text" in e) {
    return String((e as { text: string }).text);
  }
  return String(item.url ?? "Third party");
}

export function extractThirdPartyRows(
  audits: Record<string, LighthouseAudit>,
  limit = 12
): ThirdPartyRow[] {
  const audit = audits["third-party-summary"];
  const items = getTableItems(audit);
  const rows: ThirdPartyRow[] = items.map((item, i) => ({
    id: `tp-${i}`,
    name: thirdPartyName(item),
    blockingTimeMs: Number(item.blockingTime ?? item.mainThreadTime ?? 0),
    transferSize: Number(item.transferSize ?? item.transferBytes ?? 0),
  }));
  rows.sort((a, b) => b.blockingTimeMs + b.transferSize - (a.blockingTimeMs + a.transferSize));
  return rows.slice(0, limit);
}

export interface EntityRow {
  name: string;
  isFirstParty: boolean;
  origins: string[];
}

export function extractEntities(
  entities: { name: string; isFirstParty?: boolean; origins?: string[] }[] | undefined,
  limit = 10
): EntityRow[] {
  if (!entities?.length) return [];
  return entities.slice(0, limit).map((e) => ({
    name: e.name,
    isFirstParty: Boolean(e.isFirstParty),
    origins: e.origins ?? [],
  }));
}

/** Frames from Lighthouse `screenshot-thumbnails` (filmstrip) — same strip PageSpeed shows while loading. */
export interface FilmstripFrame {
  index: number;
  /** Time from navigation start (ms), when provided */
  timingMs: number;
  src: string;
}

function screenshotDataFromAudit(
  audit: LighthouseAudit | undefined
): string | null {
  const d = audit?.details;
  if (!d) return null;
  if (d.type === "screenshot" && typeof d.data === "string") {
    const src = normalizeImageDataUrl(d.data);
    return src || null;
  }
  return null;
}

/**
 * Progressive JPEG frames during load (`screenshot-thumbnails` → details.type === "filmstrip").
 */
export function extractFilmstripFrames(
  audits: Record<string, LighthouseAudit>
): FilmstripFrame[] {
  const audit = audits["screenshot-thumbnails"];
  const d = audit?.details;
  if (d?.type !== "filmstrip" || !Array.isArray(d.items)) return [];

  return d.items
    .map((item, index) => {
      const raw = typeof item.data === "string" ? item.data : "";
      const src = normalizeImageDataUrl(raw);
      if (!src) return null;
      const timingMs = Number(item.timing ?? 0);
      return {
        index,
        timingMs: Number.isFinite(timingMs) ? timingMs : index * 500,
        src,
      };
    })
    .filter((f): f is FilmstripFrame => f != null);
}

/** Last painted viewport from `final-screenshot` (often shown as the “final” frame in PSI). */
export function extractFinalScreenshotSrc(
  audits: Record<string, LighthouseAudit>
): string | null {
  return screenshotDataFromAudit(audits["final-screenshot"]);
}

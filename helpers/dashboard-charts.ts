import type { ReportRow } from "@/helpers/dashboard-domain";

export type DayCount = { dateKey: string; label: string; count: number };

export type SiteLatestScore = { name: string; fullName: string; score: number };

export type ScoreBucket = { range: string; count: number };

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDateKey(dateKey: string): Date {
  const [ys, ms, ds] = dateKey.split("-").map(Number);
  return new Date(ys, (ms ?? 1) - 1, ds ?? 1, 12, 0, 0, 0);
}

function formatDayLabel(dateKey: string): string {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    parseLocalDateKey(dateKey)
  );
}

/** Last `maxPoints` calendar days ending on the local day of the newest audit. */
export function auditsByDay(reports: ReportRow[], maxPoints = 14): DayCount[] {
  if (reports.length === 0) return [];
  let maxT = 0;
  for (const r of reports) {
    const t = new Date(r.created_at).getTime();
    if (t > maxT) maxT = t;
  }
  const endAnchor = new Date(maxT);
  const counts = new Map<string, number>();
  for (const r of reports) {
    const key = localDateKey(new Date(r.created_at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const endKey = localDateKey(endAnchor);
  const endDate = parseLocalDateKey(endKey);
  const out: DayCount[] = [];
  for (let i = maxPoints - 1; i >= 0; i--) {
    const day = new Date(endDate);
    day.setDate(day.getDate() - i);
    const dateKey = localDateKey(day);
    out.push({
      dateKey,
      label: formatDayLabel(dateKey),
      count: counts.get(dateKey) ?? 0,
    });
  }
  return out;
}

export function deviceMix(reports: ReportRow[]): { name: string; value: number }[] {
  let mobile = 0;
  let desktop = 0;
  for (const r of reports) {
    if (r.device?.toLowerCase() === "mobile") mobile += 1;
    else desktop += 1;
  }
  return [
    { name: "Desktop", value: desktop },
    { name: "Mobile", value: mobile },
  ].filter((x) => x.value > 0);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

/** One row per domain: latest run score (reports newest-first per group). */
export function latestScoresBySite(
  groups: { displayLabel: string; reports: ReportRow[] }[],
  maxSites = 12
): SiteLatestScore[] {
  const rows: SiteLatestScore[] = [];
  for (const g of groups) {
    const latest = g.reports[0];
    if (!latest || !Number.isFinite(latest.score)) continue;
    rows.push({
      name: truncate(g.displayLabel, 22),
      fullName: g.displayLabel,
      score: Math.round(latest.score),
    });
  }
  rows.sort((a, b) => b.score - a.score);
  return rows.slice(0, maxSites);
}

export function scoreBandCounts(reports: ReportRow[]): ScoreBucket[] {
  let good = 0;
  let medium = 0;
  let poor = 0;
  for (const r of reports) {
    const s = r.score;
    if (s >= 90) good += 1;
    else if (s >= 50) medium += 1;
    else poor += 1;
  }
  return [
    { range: "90–100", count: good },
    { range: "50–89", count: medium },
    { range: "0–49", count: poor },
  ];
}

export interface ReportRow {
  id: string;
  url: string;
  score: number;
  device: string;
  image: string | null;
  created_at: string;
}

export function domainKeyFromUrl(url: string | null | undefined): string {
  if (!url) return "unknown";
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return url;
  }
}

export function displayDomainLabel(domainKey: string): string {
  return domainKey === "unknown" ? "Unknown URL" : domainKey;
}

/** Newest-first per domain. */
export function groupReportsByDomain(
  reports: ReportRow[]
): { domainKey: string; displayLabel: string; reports: ReportRow[] }[] {
  const map = new Map<string, ReportRow[]>();
  for (const r of reports) {
    const key = domainKeyFromUrl(r.url);
    const arr = map.get(key) ?? [];
    arr.push(r);
    map.set(key, arr);
  }
  const out: { domainKey: string; displayLabel: string; reports: ReportRow[] }[] = [];
  for (const [domainKey, reps] of map) {
    reps.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    out.push({
      domainKey,
      displayLabel: displayDomainLabel(domainKey),
      reports: reps,
    });
  }
  out.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel));
  return out;
}

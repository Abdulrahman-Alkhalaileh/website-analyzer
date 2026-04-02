export type InsightSeverity = "critical" | "warning" | "info" | "success";

export type DashboardSeverity =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

/** Map dashboard section tone to a left-border / chip label */
export function dashboardSeverityToInsight(s: DashboardSeverity): InsightSeverity {
  switch (s) {
    case "error":
      return "critical";
    case "warning":
      return "warning";
    case "success":
      return "success";
    case "info":
      return "info";
    default:
      return "info";
  }
}

export function issueSeverityFromScore(score: number | null): InsightSeverity {
  if (score == null) return "warning";
  if (score === 0) return "critical";
  if (score < 0.5) return "warning";
  return "info";
}

export function opportunitySeverity(
  savingsBytes: number,
  savingsMs: number
): InsightSeverity {
  const score = savingsBytes / 80_000 + savingsMs / 250;
  if (score >= 6) return "critical";
  if (score >= 2) return "warning";
  return "info";
}

export function insightLabel(s: InsightSeverity): string {
  switch (s) {
    case "critical":
      return "High impact";
    case "warning":
      return "Worth fixing";
    case "success":
      return "Good";
    default:
      return "FYI";
  }
}

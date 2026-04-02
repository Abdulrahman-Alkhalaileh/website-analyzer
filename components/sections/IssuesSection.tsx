"use client";

import {
  Alert,
  Chip,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import type { IssueItem } from "@/helpers/audit";
import { LINKS } from "@/helpers/doc-links";
import { insightLabel, issueSeverityFromScore, type InsightSeverity } from "@/helpers/severity";

const DEFAULT_NO_ISSUES =
  "No failing audits stood out in this run. Re-run after you ship changes to catch regressions.";

const DEFAULT_LIST_INTRO =
  "Color = impact: red rows are usually the worst Lighthouse scores in this run. The audit id (monospace) matches Lighthouse; official docs live on Chrome for Developers—see links below (we avoid guessing per-audit URLs that often 404).";

export interface IssuesSectionProps {
  issues: IssueItem[];
  embedded?: boolean;
  /** Empty state when `issues` is empty */
  noIssuesMessage?: string;
  /** Intro above the list; omit the intro when `null`; default copy when omitted */
  listIntro?: string | null;
  /** Extra links under “Official documentation” */
  extraDocLinks?: readonly { href: string; label: string }[];
}

function severityMuiColor(
  s: InsightSeverity
): "error" | "warning" | "info" | "success" {
  if (s === "critical") return "error";
  if (s === "warning") return "warning";
  if (s === "success") return "success";
  return "info";
}

function borderForSeverity(s: InsightSeverity): string {
  if (s === "critical") return "error.main";
  if (s === "warning") return "warning.main";
  if (s === "success") return "success.main";
  return "info.main";
}

export function IssuesSection({
  issues,
  embedded,
  noIssuesMessage = DEFAULT_NO_ISSUES,
  listIntro = DEFAULT_LIST_INTRO,
  extraDocLinks,
}: IssuesSectionProps) {
  const innerEmpty = (
    <Alert severity="success" variant="outlined">
      {noIssuesMessage}
    </Alert>
  );

  if (issues.length === 0) {
    if (embedded) return innerEmpty;
    return (
      <Paper
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        elevation={0}
        sx={{ p: 3, border: 1, borderColor: "divider" }}
      >
        {innerEmpty}
      </Paper>
    );
  }

  const list = (
    <Stack gap={1.5}>
      {listIntro ? (
        <Typography variant="body2" color="text.secondary">
          {listIntro}
        </Typography>
      ) : null}
      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {issues.map((issue, index) => {
          const sev = issueSeverityFromScore(issue.score);
          return (
            <ListItem
              key={issue.id}
              sx={{
                alignItems: "flex-start",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                bgcolor:
                  sev === "critical"
                    ? "rgba(239,68,68,0.08)"
                    : sev === "warning"
                      ? "rgba(249,115,22,0.06)"
                      : "rgba(56,189,248,0.05)",
                borderLeftWidth: 4,
                borderLeftColor: borderForSeverity(sev),
              }}
              component={motion.div}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * index }}
            >
              <Stack gap={1} sx={{ width: "100%" }}>
                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                  <Chip
                    size="small"
                    label={insightLabel(sev)}
                    color={severityMuiColor(sev)}
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                    {issue.id}
                  </Typography>
                </Stack>
                <ListItemText
                  primary={issue.title}
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.65 }}>
                      {issue.friendly}
                    </Typography>
                  }
                  primaryTypographyProps={{ fontWeight: 700, variant: "body1" }}
                  secondaryTypographyProps={{ component: "div" }}
                />
              </Stack>
            </ListItem>
          );
        })}
      </List>
      <Stack gap={0.75} sx={{ pt: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Official documentation
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <Link href={LINKS.lighthouseIndex} target="_blank" rel="noopener noreferrer" fontWeight={600}>
            Lighthouse documentation (all categories) ↗
          </Link>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <Link
            href={LINKS.lighthousePerformance}
            target="_blank"
            rel="noopener noreferrer"
            fontWeight={600}
          >
            Performance audits &amp; scoring ↗
          </Link>
        </Typography>
        {extraDocLinks?.map((link) => (
          <Typography key={link.href} variant="caption" color="text.secondary">
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              fontWeight={600}
            >
              {link.label}
            </Link>
          </Typography>
        ))}
      </Stack>
    </Stack>
  );

  if (embedded) return list;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      elevation={0}
      sx={{ p: { xs: 2, sm: 2.5 }, border: 1, borderColor: "divider" }}
    >
      {list}
    </Paper>
  );
}

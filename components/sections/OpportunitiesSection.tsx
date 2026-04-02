"use client";

import { Chip, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { OpportunityExtract } from "@/helpers/audit";
import { LINKS } from "@/helpers/doc-links";
import { formatBytes, formatMs } from "@/helpers/lighthouse-extract";
import { insightLabel, opportunitySeverity } from "@/helpers/severity";

export interface OpportunitiesSectionProps {
  opportunities: OpportunityExtract[];
  embedded?: boolean;
}

export function OpportunitiesSection({
  opportunities,
  embedded,
}: OpportunitiesSectionProps) {
  if (opportunities.length === 0) return null;

  const inner = (
    <Stack gap={2}>
      <Typography variant="body2" color="text.secondary">
        Orange/red rows = larger estimated savings (time or bytes). These come
        from Lighthouse &quot;opportunity&quot; audits—not guarantees, but good
        prioritization hints.
      </Typography>
      <Stack gap={1}>
        {opportunities.map((o, index) => {
          const sev = opportunitySeverity(o.savingsBytes, o.savingsMs);
          const chipColor =
            sev === "critical" ? "error" : sev === "warning" ? "warning" : "info";
          return (
            <Stack
              key={o.id}
              component={motion.div}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 * index }}
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
              sx={{
                py: 1.5,
                px: 1.5,
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                borderLeftWidth: 4,
                borderLeftColor:
                  sev === "critical"
                    ? "error.main"
                    : sev === "warning"
                      ? "warning.main"
                      : "info.main",
                bgcolor:
                  sev === "critical"
                    ? "rgba(239,68,68,0.06)"
                    : sev === "warning"
                      ? "rgba(249,115,22,0.05)"
                      : "rgba(56,189,248,0.04)",
              }}
            >
              <Stack gap={0.75} flex="1 1 200px">
                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                  <Chip size="small" label={insightLabel(sev)} color={chipColor} variant="outlined" />
                  <Typography variant="body2" fontWeight={700}>
                    {o.title}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="flex-end">
                {o.savingsMs > 0 ? (
                  <Typography
                    variant="body2"
                    color={sev === "critical" ? "error.light" : "warning.light"}
                    sx={{ fontFeatureSettings: '"tnum"' }}
                  >
                    ~{formatMs(o.savingsMs)} faster
                  </Typography>
                ) : null}
                {o.savingsBytes > 0 ? (
                  <Typography variant="body2" color="secondary.light" sx={{ fontFeatureSettings: '"tnum"' }}>
                    ~{formatBytes(o.savingsBytes)} smaller
                  </Typography>
                ) : null}
                {o.displayValue ? (
                  <Typography variant="body2" color="text.secondary">
                    {o.displayValue}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        How Lighthouse scores opportunities:{" "}
        <Typography
          component="a"
          variant="caption"
          href={LINKS.lighthouseScoring}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "secondary.light", fontWeight: 600 }}
        >
          Chrome docs ↗
        </Typography>
      </Typography>
    </Stack>
  );

  if (embedded) return inner;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      elevation={0}
      sx={{ p: { xs: 2, sm: 2.5 }, border: 1, borderColor: "divider" }}
    >
      {inner}
    </Paper>
  );
}

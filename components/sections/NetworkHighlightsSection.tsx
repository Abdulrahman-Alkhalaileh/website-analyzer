"use client";

import { Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { NetworkHighlight } from "@/helpers/audit";

export interface NetworkHighlightsSectionProps {
  highlights: NetworkHighlight[];
  embedded?: boolean;
}

function rowSeverity(label: string): "warning" | "neutral" {
  if (/TTFB|server response/i.test(label)) return "warning";
  if (/total transfer|byte|weight/i.test(label)) return "warning";
  return "neutral";
}

export function NetworkHighlightsSection({
  highlights,
  embedded,
}: NetworkHighlightsSectionProps) {
  if (highlights.length === 0) return null;

  const inner = (
    <Stack gap={2}>
      <Typography variant="body2" color="text.secondary">
        Highlights are quick reads from Lighthouse audits. Rows with a warm
        border are usually worth eyeballing first (server delay or total weight).
      </Typography>
      <Stack gap={0}>
        {highlights.map((h) => {
          const sev = rowSeverity(h.label);
          return (
            <Stack
              key={h.label}
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              gap={2}
              flexWrap="wrap"
              sx={{
                py: 1.25,
                px: 1,
                borderBottom: 1,
                borderColor: "divider",
                borderLeftWidth: sev === "warning" ? 3 : 0,
                borderLeftStyle: "solid",
                borderLeftColor: sev === "warning" ? "warning.main" : "transparent",
                bgcolor:
                  sev === "warning" ? "rgba(249,115,22,0.05)" : "transparent",
                "&:last-of-type": { borderBottom: "none" },
              }}
            >
              <Typography
                variant="body2"
                color={sev === "warning" ? "warning.light" : "text.secondary"}
              >
                {h.label}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontFeatureSettings: '"tnum"' }}>
                {h.value}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
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

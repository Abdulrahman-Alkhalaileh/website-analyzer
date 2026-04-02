"use client";

import { Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { ResourceTypeRow } from "@/helpers/audit";
import { formatBytes } from "@/helpers/lighthouse-extract";

export interface ResourceBreakdownSectionProps {
  rows: ResourceTypeRow[];
  embedded?: boolean;
}

export function ResourceBreakdownSection({
  rows,
  embedded,
}: ResourceBreakdownSectionProps) {
  if (rows.length === 0) return null;

  const inner = (
    <Stack gap={2}>
      <Typography variant="body2" color="text.secondary">
        Summarized from Lighthouse&apos;s resource summary table. Large transfer
        rows are highlighted lightly—useful for spotting heavy JS or images.
      </Typography>
      <Stack gap={0}>
        {rows.map((r) => {
          const heavy = r.transferBytes > 500_000;
          return (
            <Stack
              key={r.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              flexWrap="wrap"
              sx={{
                py: 1.25,
                px: 0.5,
                borderBottom: 1,
                borderColor: "divider",
                borderLeftWidth: heavy ? 3 : 0,
                borderLeftStyle: "solid",
                borderLeftColor: heavy ? "warning.main" : "transparent",
                bgcolor: heavy ? "rgba(249,115,22,0.04)" : "transparent",
                "&:last-of-type": { borderBottom: "none" },
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                {r.label}
              </Typography>
              <Stack direction="row" gap={2}>
                <Typography variant="body2" color="text.secondary" sx={{ fontFeatureSettings: '"tnum"' }}>
                  {r.requestCount} req
                </Typography>
                <Typography
                  variant="body2"
                  color={heavy ? "warning.light" : "text.secondary"}
                  sx={{ fontFeatureSettings: '"tnum"' }}
                >
                  {formatBytes(r.transferBytes)}
                </Typography>
              </Stack>
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

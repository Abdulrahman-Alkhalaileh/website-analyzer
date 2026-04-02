"use client";

import { Chip, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { ThirdPartyRow } from "@/helpers/audit";
import { formatBytes, formatMs } from "@/helpers/lighthouse-extract";

export interface ThirdPartySectionProps {
  rows: ThirdPartyRow[];
  embedded?: boolean;
}

export function ThirdPartySection({ rows, embedded }: ThirdPartySectionProps) {
  if (rows.length === 0) return null;

  const inner = (
    <Stack gap={2}>
      <Typography variant="body2" color="text.secondary">
        Third-party rows with more main-thread time are flagged—these often drag
        interactivity even when transfer size looks small.
      </Typography>
      <Stack gap={1}>
        {rows.map((r, index) => {
          const hot = r.blockingTimeMs > 250;
          return (
            <Stack
              key={r.id}
              component={motion.div}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * index }}
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
              sx={{
                py: 1.25,
                px: 1,
                borderBottom: 1,
                borderColor: "divider",
                borderLeftWidth: hot ? 3 : 0,
                borderLeftStyle: "solid",
                borderLeftColor: hot ? "error.main" : "transparent",
                bgcolor: hot ? "rgba(239,68,68,0.05)" : "transparent",
                "&:last-of-type": { borderBottom: "none" },
              }}
            >
              <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" sx={{ flex: "1 1 200px" }}>
                <Typography variant="body2" fontWeight={700}>
                  {r.name}
                </Typography>
                {hot ? (
                  <Chip size="small" label="Main-thread heavy" color="error" variant="outlined" />
                ) : null}
              </Stack>
              <Stack direction="row" gap={2} flexWrap="wrap">
                {r.blockingTimeMs > 0 ? (
                  <Typography
                    variant="body2"
                    color={hot ? "error.light" : "warning.light"}
                    sx={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {formatMs(r.blockingTimeMs)} main-thread
                  </Typography>
                ) : null}
                <Typography variant="body2" color="text.secondary" sx={{ fontFeatureSettings: '"tnum"' }}>
                  {formatBytes(r.transferSize)} transfer
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

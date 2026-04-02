"use client";

import { Alert, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

export interface RunWarningsSectionProps {
  warnings: string[];
  embedded?: boolean;
}

function lineSeverity(text: string): "error" | "warning" {
  const t = text.toLowerCase();
  if (
    /\berror\b|\bfail|\binvalid\b|\bunable\b|\btimeout\b|\bno storage\b/.test(t)
  ) {
    return "error";
  }
  return "warning";
}

export function RunWarningsSection({ warnings, embedded }: RunWarningsSectionProps) {
  if (warnings.length === 0) return null;

  const inner = (
    <Stack gap={1}>
      {warnings.map((w, i) => {
        const sev = lineSeverity(w);
        return (
          <Alert key={i} severity={sev} variant="outlined">
            {w}
          </Alert>
        );
      })}
    </Stack>
  );

  if (embedded) return inner;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        border: 1,
        borderColor: "warning.dark",
        borderLeftWidth: 4,
        borderLeftColor: "warning.main",
        bgcolor: "rgba(249,115,22,0.06)",
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} color="warning.light" sx={{ mb: 1 }}>
        Lighthouse warnings
      </Typography>
      {inner}
    </Paper>
  );
}

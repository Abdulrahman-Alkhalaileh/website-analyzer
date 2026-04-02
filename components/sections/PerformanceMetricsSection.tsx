"use client";

import { LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { MetricDisplay } from "@/helpers/audit";
import { LINKS } from "@/helpers/doc-links";

function barTone(
  percent: number
): "error" | "warning" | "success" {
  if (percent < 50) return "error";
  if (percent < 90) return "warning";
  return "success";
}

function MetricRows({ items }: { items: MetricDisplay[] }) {
  if (items.length === 0) return null;
  return (
    <Stack gap={2.5}>
      {items.map((m) => {
        const tone = barTone(m.barPercent);
        return (
          <Stack key={`${m.id}-${m.label}`} gap={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              gap={2}
            >
              <Typography variant="body2" fontWeight={600}>
                {m.label}
              </Typography>
              <Typography
                variant="body2"
                color={
                  tone === "error"
                    ? "error.light"
                    : tone === "warning"
                      ? "warning.light"
                      : "success.light"
                }
                sx={{ fontFeatureSettings: '"tnum"' }}
              >
                {m.displayValue}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={m.barPercent}
              color={tone}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "rgba(255,255,255,0.06)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                },
              }}
            />
          </Stack>
        );
      })}
    </Stack>
  );
}

export interface PerformanceMetricsSectionProps {
  coreWebVitals: MetricDisplay[];
  labMetrics: MetricDisplay[];
  embedded?: boolean;
}

export function PerformanceMetricsSection({
  coreWebVitals,
  labMetrics,
  embedded,
}: PerformanceMetricsSectionProps) {
  if (coreWebVitals.length === 0 && labMetrics.length === 0) return null;

  const inner = (
    <Stack gap={3}>
      <Typography variant="body2" color="text.secondary">
        Bar color = audit health: green ≥90, orange 50–89, red under 50 (for
        metrics where Lighthouse assigns a numeric score).
      </Typography>

      {coreWebVitals.length > 0 ? (
        <Stack gap={1.5}>
          <Typography variant="overline" color="primary.light" fontWeight={700}>
            Core Web Vitals (lab)
          </Typography>
          <MetricRows items={coreWebVitals} />
        </Stack>
      ) : null}

      {labMetrics.length > 0 ? (
        <Stack gap={1.5}>
          <Typography variant="overline" color="text.secondary" fontWeight={700}>
            Other lab timings
          </Typography>
          <MetricRows items={labMetrics} />
        </Stack>
      ) : null}

      <Typography variant="caption" color="text.secondary">
        What are Web Vitals?{" "}
        <Typography
          component="a"
          variant="caption"
          href={LINKS.webVitals}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "secondary.light", fontWeight: 600 }}
        >
          web.dev ↗
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
      transition={{ duration: 0.4 }}
      elevation={0}
      sx={{ p: { xs: 2, sm: 2.5 }, border: 1, borderColor: "divider" }}
    >
      {inner}
    </Paper>
  );
}

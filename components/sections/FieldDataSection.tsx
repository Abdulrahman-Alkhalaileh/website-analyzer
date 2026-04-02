"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import type { FieldMetricRow } from "@/helpers/audit";
import { LINKS } from "@/helpers/doc-links";

export interface FieldDataSectionProps {
  urlRows: FieldMetricRow[];
  originRows: FieldMetricRow[];
  overallUrl?: string;
  overallOrigin?: string;
  embedded?: boolean;
}

function categoryColor(cat?: string): "success" | "warning" | "error" | "default" {
  if (!cat) return "default";
  const c = cat.toUpperCase();
  if (c === "FAST") return "success";
  if (c === "AVERAGE") return "warning";
  if (c === "SLOW") return "error";
  return "default";
}

function rowBg(cat?: string): string {
  if (!cat) return "transparent";
  const c = cat.toUpperCase();
  if (c === "SLOW") return "rgba(239,68,68,0.07)";
  if (c === "AVERAGE") return "rgba(249,115,22,0.06)";
  if (c === "FAST") return "rgba(34,197,94,0.06)";
  return "transparent";
}

function MetricTable({ rows }: { rows: FieldMetricRow[] }) {
  return (
    <Stack gap={0}>
      {rows.map((row) => (
        <Stack
          key={row.key}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
          sx={{
            py: 1.25,
            px: 1,
            borderBottom: 1,
            borderColor: "divider",
            borderLeftWidth: 3,
            borderLeftStyle: "solid",
            borderLeftColor:
              row.category?.toUpperCase() === "SLOW"
                ? "error.main"
                : row.category?.toUpperCase() === "AVERAGE"
                  ? "warning.main"
                  : row.category?.toUpperCase() === "FAST"
                    ? "success.main"
                    : "transparent",
            bgcolor: rowBg(row.category),
            "&:last-of-type": { borderBottom: "none" },
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {row.label}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            {row.percentile != null ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontFeatureSettings: '"tnum"' }}>
                p{row.percentile}
              </Typography>
            ) : null}
            {row.category ? (
              <Chip
                size="small"
                label={row.category}
                color={categoryColor(row.category)}
                variant="filled"
              />
            ) : null}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

export function FieldDataSection({
  urlRows,
  originRows,
  overallUrl,
  overallOrigin,
  embedded,
}: FieldDataSectionProps) {
  const hasUrl = urlRows.length > 0 || Boolean(overallUrl);
  const hasOrigin = originRows.length > 0 || Boolean(overallOrigin);
  if (!hasUrl && !hasOrigin) return null;

  const inner = (
    <Stack gap={2}>
      <Typography variant="body2" color="text.secondary">
        Field data uses real Chrome users (CrUX). Red / orange rows are slower
        experience buckets—not errors in your code by themselves.
      </Typography>

      {hasUrl ? (
        <Accordion
          defaultExpanded
          disableGutters
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<Typography sx={{ color: "text.secondary" }}>▼</Typography>}>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="subtitle2" fontWeight={700}>
                This URL (field)
              </Typography>
              {overallUrl ? (
                <Chip size="small" label={overallUrl} color="primary" variant="outlined" />
              ) : null}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {urlRows.length > 0 ? (
              <MetricTable rows={urlRows} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No per-metric field data for this exact URL (often low traffic).
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ) : null}

      {hasOrigin ? (
        <Accordion
          defaultExpanded={!hasUrl}
          disableGutters
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<Typography sx={{ color: "text.secondary" }}>▼</Typography>}>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="subtitle2" fontWeight={700}>
                Whole origin (field)
              </Typography>
              {overallOrigin ? (
                <Chip size="small" label={overallOrigin} color="secondary" variant="outlined" />
              ) : null}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {originRows.length > 0 ? (
              <MetricTable rows={originRows} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No origin-level field rows in this response.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ) : null}

      <Typography variant="caption" color="text.secondary">
        About CrUX:{" "}
        <Typography
          component="a"
          variant="caption"
          href={LINKS.chromeUxReport}
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

"use client";

import { Alert, Chip, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { RunInfo } from "@/helpers/audit";
import { LINKS } from "@/helpers/doc-links";

export interface RunMetadataSectionProps {
  runInfo: RunInfo;
  finalUrl: string | null;
  embedded?: boolean;
}

export function RunMetadataSection({
  runInfo,
  finalUrl,
  embedded,
}: RunMetadataSectionProps) {
  const inner = (
    <Stack gap={2}>
      <Alert severity="info" variant="outlined">
        Neutral / FYI: technical metadata about this Lighthouse run—not a pass/fail
        score. Compare runs using the same{" "}
        <Typography component="span" fontWeight={700}>
          Lab device
        </Typography>{" "}
        setting.
      </Alert>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1}
        useFlexGap
        sx={{ columnGap: 1, rowGap: 1 }}
      >
        <Chip
          size="small"
          label={`Lighthouse ${runInfo.lighthouseVersion}`}
          variant="outlined"
          color="info"
        />
        <Chip
          size="small"
          label={
            runInfo.labStrategy === "mobile"
              ? "PageSpeed: mobile"
              : "PageSpeed: desktop"
          }
          color="primary"
          variant="outlined"
        />
        {runInfo.formFactor ? (
          <Chip size="small" label={runInfo.formFactor} variant="outlined" />
        ) : null}
        {runInfo.channel ? (
          <Chip size="small" label={runInfo.channel} variant="outlined" />
        ) : null}
        {runInfo.benchmarkIndex != null ? (
          <Chip
            size="small"
            label={`CPU benchmark ~${Math.round(runInfo.benchmarkIndex)}`}
            variant="outlined"
            color="default"
          />
        ) : null}
      </Stack>
      <Stack gap={0.5}>
        <Typography variant="body2" color="text.secondary">
          Fetched:{" "}
          <Typography component="span" color="text.primary" fontWeight={500}>
            {new Date(runInfo.fetchTime).toLocaleString()}
          </Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analysis runtime:{" "}
          <Typography component="span" color="text.primary" fontWeight={500}>
            {(runInfo.analysisDurationMs / 1000).toFixed(1)}s
          </Typography>
        </Typography>
        {finalUrl ? (
          <Typography variant="body2" color="text.secondary">
            Final URL:{" "}
            <Typography component="span" color="text.primary" fontWeight={500}>
              {finalUrl}
            </Typography>
          </Typography>
        ) : null}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        PageSpeed API reference:{" "}
        <Typography
          component="a"
          variant="caption"
          href={LINKS.pageSpeedDocs}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "secondary.light", fontWeight: 600 }}
        >
          Google docs ↗
        </Typography>
      </Typography>
    </Stack>
  );

  if (embedded) return inner;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      elevation={0}
      sx={{ p: { xs: 2, sm: 2.5 }, border: 1, borderColor: "divider" }}
    >
      {inner}
    </Paper>
  );
}

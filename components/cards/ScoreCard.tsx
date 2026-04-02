"use client";

import { Chip, Paper, Stack, Typography } from "@mui/material";
import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ScoreBand } from "@/helpers/audit";

function bandColor(
  band: ScoreBand,
  palette: { score: { good: string; medium: string; poor: string } }
): string {
  if (band === "good") return palette.score.good;
  if (band === "medium") return palette.score.medium;
  return palette.score.poor;
}

function useCountUp(target: number | null, delayMs: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target == null) return;
    const controls = animate(0, target, {
      duration: 1.15,
      delay: delayMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setValue(Math.round(n)),
    });
    return () => controls.stop();
  }, [target, delayMs]);
  return target == null ? null : value;
}

export interface ScoreCardProps {
  label: string;
  /** 0–1 Lighthouse category score */
  score: number | null;
  delay: number;
}

export function ScoreCard({ label, score, delay }: ScoreCardProps) {
  const target = score == null ? null : Math.round(score * 100);
  const animated = useCountUp(target, delay);

  const band: ScoreBand =
    target == null ? "medium" : target >= 90 ? "good" : target >= 50 ? "medium" : "poor";

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.45 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      elevation={0}
      sx={(theme) => ({
        flex: 1,
        minWidth: 140,
        p: 2.5,
        border: 1,
        borderColor: "divider",
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, rgba(20,20,20,0.96) 100%)`,
      })}
    >
      <Stack gap={1.5}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
        <Stack direction="row" alignItems="baseline" gap={1}>
          <Typography
            variant="h3"
            component="span"
            sx={(theme) => ({
              fontFeatureSettings: '"tnum"',
              color: bandColor(band, theme.palette),
            })}
          >
            {target == null ? "—" : animated ?? 0}
          </Typography>
          {target != null ? (
            <Typography variant="body2" color="text.secondary">
              /100
            </Typography>
          ) : null}
        </Stack>
        <Chip
          size="small"
          label={
            target == null
              ? "Not run"
              : band === "good"
                ? "Strong"
                : band === "medium"
                  ? "Room to improve"
                  : "Needs attention"
          }
          sx={(theme) => ({
            alignSelf: "flex-start",
            bgcolor: `${bandColor(band, theme.palette)}22`,
            color: bandColor(band, theme.palette),
            fontWeight: 600,
          })}
        />
      </Stack>
    </Paper>
  );
}

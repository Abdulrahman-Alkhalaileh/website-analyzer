"use client";

import { Stack } from "@mui/material";
import { ScoreCard } from "@/components/cards/ScoreCard";
import type { CategoryScores } from "@/helpers/audit";

export interface ScoreCardsRowProps {
  scores: CategoryScores;
}

export function ScoreCardsRow({ scores }: ScoreCardsRowProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      gap={2}
      useFlexGap
      sx={{ width: "100%" }}
    >
      <ScoreCard label="Performance" score={scores.performance} delay={0} />
      <ScoreCard label="SEO" score={scores.seo} delay={80} />
      <ScoreCard label="Accessibility" score={scores.accessibility} delay={160} />
      <ScoreCard
        label="Best Practices"
        score={scores.bestPractices}
        delay={240}
      />
    </Stack>
  );
}

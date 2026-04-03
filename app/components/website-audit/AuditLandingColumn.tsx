"use client";

import { Stack } from "@mui/material";
import { motion } from "framer-motion";
import type { FC, ReactNode } from "react";
import type { LabStrategy } from "@/helpers/audit";
import { AuditGradientRule } from "./AuditGradientRule";
import { LandingHero } from "./LandingHero";

export type AuditLandingColumnProps = {
  seoIntro: ReactNode;
  url: string;
  onUrlChange: (value: string) => void;
  strategy: LabStrategy;
  onStrategyChange: (value: LabStrategy) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string | null;
};

export const AuditLandingColumn: FC<AuditLandingColumnProps> = ({
  seoIntro,
  ...hero
}) => (
  <Stack gap={2.5} sx={{ maxWidth: 720 }}>
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 18,
        delay: 0.06,
      }}
    >
      {seoIntro}
    </motion.div>
    <AuditGradientRule variant="landing" />
    <LandingHero
      url={hero.url}
      onUrlChange={hero.onUrlChange}
      strategy={hero.strategy}
      onStrategyChange={hero.onStrategyChange}
      onAnalyze={hero.onAnalyze}
      loading={hero.loading}
      error={hero.error}
    />
  </Stack>
);

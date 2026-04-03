"use client";

import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { FC } from "react";

export type AuditGradientRuleProps = {
  variant: "landing" | "results";
};

export const AuditGradientRule: FC<AuditGradientRuleProps> = ({ variant }) => (
  <Box
    sx={{
      height: 1,
      mx: variant === "landing" ? 0.5 : 0,
      mb: variant === "landing" ? 0.5 : 0,
      maxWidth: variant === "results" ? 920 : undefined,
      borderRadius: 1,
      background: (t) =>
        `linear-gradient(90deg, transparent, ${alpha(
          t.palette.primary.main,
          variant === "landing" ? 0.45 : 0.4
        )}, transparent)`,
      opacity: variant === "landing" ? 0.85 : 0.9,
    }}
  />
);

"use client";

import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "@/components/brand/BrandMark";
import type { LabStrategy } from "@/helpers/audit";

export interface ResultsHeroProps {
  finalUrl: string | null;
  performanceScore: number | null;
  labStrategy: LabStrategy;
  onNewAudit: () => void;
}

export function ResultsHero({
  finalUrl,
  performanceScore,
  labStrategy,
  onNewAudit,
}: ResultsHeroProps) {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme.palette.mode === "dark";

  const titleGradient = isDark
    ? "linear-gradient(115deg, #FFFFFF 0%, #E9D5FF 55%, #C4B5FD 100%)"
    : "linear-gradient(115deg, #0F172A 0%, #4C1D95 100%)";

  const spring = reduce
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 78, damping: 19 };

  return (
    <Stack
      component={motion.div}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      gap={2.5}
      sx={{ width: "100%" }}
    >
      <Box
        sx={{
          boxSizing: "border-box",
          width: "100%",
          p: { xs: 2.5, sm: 3 },
          borderRadius: 2.5,
          border: 1,
          borderColor: isDark ? alpha("#fff", 0.1) : alpha("#0f172a", 0.08),
          background: isDark
            ? `linear-gradient(150deg, ${alpha("#fff", 0.06)} 0%, ${alpha("#fff", 0.02)} 45%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
            : `linear-gradient(150deg, #FFFFFF 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          backdropFilter: "blur(14px)",
          boxShadow: isDark
            ? `0 0 0 1px ${alpha("#fff", 0.04)}, 0 20px 56px -20px rgba(0,0,0,0.55)`
            : `0 0 0 1px ${alpha("#0f172a", 0.06)}, 0 16px 40px -16px rgba(15,23,42,0.1)`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2.5}
        >
          <Stack direction="row" alignItems="flex-start" gap={2} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                flexShrink: 0,
                filter: isDark
                  ? "drop-shadow(0 0 20px rgba(139,92,246,0.35))"
                  : "drop-shadow(0 0 14px rgba(124,58,237,0.22))",
              }}
            >
              <BrandMark size={48} />
            </Box>
            <Stack gap={1} sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  background: titleGradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your audit is ready
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  wordBreak: "break-word",
                  lineHeight: 1.65,
                  maxWidth: 560,
                }}
              >
                {finalUrl ?? "Results from your latest Lighthouse run."}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
                <Chip
                  size="small"
                  label={`${labStrategy === "mobile" ? "Mobile" : "Desktop"} lab`}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    borderColor: alpha(theme.palette.primary.main, 0.45),
                    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
                  }}
                />
                {performanceScore != null ? (
                  <Chip
                    size="small"
                    label={`Performance ${Math.round(performanceScore)}`}
                    color={
                      performanceScore >= 90
                        ? "success"
                        : performanceScore >= 50
                          ? "warning"
                          : "error"
                    }
                    variant="filled"
                    sx={{ fontWeight: 700 }}
                  />
                ) : null}
              </Stack>
            </Stack>
          </Stack>
          <Button
            variant="outlined"
            size="large"
            onClick={onNewAudit}
            sx={{
              flexShrink: 0,
              alignSelf: { xs: "stretch", sm: "center" },
              borderRadius: 2,
              fontWeight: 600,
              borderWidth: 2,
              px: 2.5,
              "&:hover": { borderWidth: 2 },
            }}
          >
            New audit
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

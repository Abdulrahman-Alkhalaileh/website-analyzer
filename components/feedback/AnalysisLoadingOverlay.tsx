"use client";

import {
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const STEPS = [
  "Measuring paint timings & Core Web Vitals…",
  "Tracing network waterfall & critical path…",
  "Weighing JavaScript bundles & images…",
  "Checking SEO, accessibility & best practices…",
  "Synthesizing scores and recommendations…",
];

const BAR_COUNT = 12;

export interface AnalysisLoadingOverlayProps {
  open: boolean;
  targetUrl: string;
}

export function AnalysisLoadingOverlay({
  open,
  targetUrl,
}: AnalysisLoadingOverlayProps) {
  const theme = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(8);
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      setStepIndex((s) => (s + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      setFakeProgress((p) => {
        if (p >= 92) return 8 + Math.random() * 6;
        return p + 3 + Math.random() * 5;
      });
    }, 400);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  const scrim = isDark
    ? alpha("#000000", 0.72)
    : alpha("#0f172a", 0.36);

  const panelBg = isDark
    ? `linear-gradient(155deg, ${alpha("#fff", 0.08)} 0%, ${alpha("#fff", 0.02)} 40%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
    : `linear-gradient(155deg, ${alpha("#fff", 0.58)} 0%, ${alpha("#fff", 0.28)} 42%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`;

  const panelShadow = isDark
    ? `0 0 0 1px ${alpha("#fff", 0.05)}, 0 28px 80px -20px rgba(0,0,0,0.65), 0 0 60px -20px ${alpha(theme.palette.primary.main, 0.25)}`
    : `0 0 0 1px ${alpha("#fff", 0.55)}, 0 0 0 1px ${alpha("#0f172a", 0.06)} inset, 0 20px 48px -12px ${alpha("#0f172a", 0.12)}, 0 0 48px -14px ${alpha(theme.palette.primary.main, 0.22)}`;

  return (
    <Stack
      component={motion.div}
      role="status"
      aria-live="polite"
      aria-busy="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: (t) => t.zIndex.modal + 2,
        alignItems: "center",
        justifyContent: "center",
        bgcolor: scrim,
        backdropFilter: isDark ? "blur(10px)" : "blur(14px)",
      }}
    >
      <Stack
        component={motion.div}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        gap={3}
        sx={{
          boxSizing: "border-box",
          width: "min(440px, calc(100vw - 32px))",
          flexShrink: 0,
          mx: 2,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: 1,
          borderColor: isDark ? alpha("#fff", 0.1) : alpha("#fff", 0.72),
          background: panelBg,
          backdropFilter: isDark
            ? "blur(20px)"
            : "blur(24px) saturate(1.15)",
          boxShadow: panelShadow,
          overflow: "hidden",
        }}
      >
        <Stack alignItems="center" gap={2}>
          <Stack position="relative" sx={{ width: 96, height: 96 }}>
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                border: `2px solid ${alpha(theme.palette.secondary.main, 0.45)}`,
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
            />
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ position: "absolute", inset: 0 }}
            >
              <CircularProgress
                size={72}
                thickness={3}
                sx={{ color: "primary.main" }}
              />
            </Stack>
          </Stack>
          <Typography variant="h6" textAlign="center" fontWeight={700}>
            Calculating your audit
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ wordBreak: "break-word" }}
          >
            {targetUrl || "your site"}
          </Typography>
        </Stack>

        <Stack gap={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Lab measurement in progress
            </Typography>
            <Typography
              variant="caption"
              component="span"
              sx={{
                fontVariantNumeric: "tabular-nums",
                color: "primary.main",
                minWidth: "2.75em",
                textAlign: "right",
              }}
            >
              {Math.min(99, Math.round(fakeProgress))}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(99, fakeProgress)}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.text.primary, isDark ? 0.1 : 0.08),
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="center" gap={0.75} sx={{ height: 40 }}>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <WaveBar key={i} index={i} />
          ))}
        </Stack>

        <Stack
          minHeight={{ xs: 68, sm: 56 }}
          justifyContent="center"
          sx={{ width: "100%" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{ width: "100%" }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{
                  width: "100%",
                  minHeight: "3.25em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {STEPS[stepIndex]}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Stack>
      </Stack>
    </Stack>
  );
}

function WaveBar({ index }: { index: number }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const p = theme.palette.primary.main;
  const s = theme.palette.secondary.main;
  const background = isDark
    ? `linear-gradient(180deg, ${alpha(p, 0.95)}, ${alpha(s, 0.78)})`
    : `linear-gradient(180deg, ${alpha(p, 0.88)}, ${alpha(s, 0.75)})`;

  return (
    <motion.div
      style={{
        width: 5,
        borderRadius: 3,
        background,
      }}
      animate={{
        height: [12, 28 + (index % 5) * 6, 14, 32, 12],
        opacity: [0.45, 1, 0.55, 0.95, 0.45],
      }}
      transition={{
        duration: 1.35 + (index % 4) * 0.08,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.06,
      }}
    />
  );
}

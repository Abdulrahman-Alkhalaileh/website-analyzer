"use client";

import { CircularProgress, LinearProgress, Stack, Typography } from "@mui/material";
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
  const [stepIndex, setStepIndex] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(8);

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
        bgcolor: "rgba(5,5,5,0.78)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack
        gap={3}
        sx={{
          maxWidth: 440,
          mx: 2,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "rgba(20,20,20,0.92)",
          boxShadow: "0 0 0 1px rgba(139,92,246,0.15), 0 24px 80px rgba(0,0,0,0.65)",
        }}
      >
        <Stack alignItems="center" gap={2}>
          <Stack position="relative" sx={{ width: 96, height: 96 }}>
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(139,92,246,0.35)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                border: "2px solid rgba(56,189,248,0.4)",
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
              sx={{ fontFeatureSettings: '"tnum"', color: "primary.light" }}
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
              bgcolor: "rgba(255,255,255,0.06)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: (t) =>
                  `linear-gradient(90deg, ${t.palette.primary.dark}, ${t.palette.secondary.main})`,
              },
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="center" gap={0.75} sx={{ height: 40 }}>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <WaveBar key={i} index={i} />
          ))}
        </Stack>

        <Stack minHeight={56} justifyContent="center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <Typography variant="body2" color="text.secondary" textAlign="center">
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
  return (
    <motion.div
      style={{
        width: 5,
        borderRadius: 3,
        background:
          "linear-gradient(180deg, rgba(139,92,246,0.95), rgba(56,189,248,0.75))",
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

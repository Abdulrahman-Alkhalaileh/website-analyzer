"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export function LandingBackdrop() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", {
    noSsr: true,
  });

  const purple = isDark
    ? "rgba(139, 92, 246, 0.22)"
    : "rgba(124, 58, 237, 0.14)";
  const cyan = isDark ? "rgba(56, 189, 248, 0.12)" : "rgba(3, 105, 161, 0.1)";

  if (reduceMotion) {
    return (
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          background: isDark
            ? `radial-gradient(ellipse 90% 55% at 50% -15%, ${alpha(
                theme.palette.primary.main,
                0.18
              )}, transparent 60%)`
            : `radial-gradient(ellipse 90% 55% at 50% -15%, ${alpha(
                theme.palette.primary.main,
                0.12
              )}, transparent 60%)`,
        }}
      />
    );
  }

  return (
    <Box
      aria-hidden
      className="landing-ambient-grid"
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-14%",
          right: "-8%",
          width: "min(58vw, 400px)",
          aspectRatio: "1",
          borderRadius: "50%",
          background: purple,
          filter: "blur(40px)",
          transform: "translateZ(0)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-6%",
          left: "-12%",
          width: "min(52vw, 340px)",
          aspectRatio: "1",
          borderRadius: "50%",
          background: cyan,
          filter: "blur(36px)",
          transform: "translateZ(0)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "radial-gradient(ellipse 85% 48% at 50% -18%, rgba(139,92,246,0.1), transparent 58%)"
            : "radial-gradient(ellipse 85% 48% at 50% -18%, rgba(124,58,237,0.07), transparent 58%)",
          transform: "translateZ(0)",
        }}
      />
    </Box>
  );
}

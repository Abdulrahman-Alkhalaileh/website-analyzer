"use client";

import { Box, useTheme } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";

/** Soft gradient orbs + grid — only for the pre-results landing. */
export function LandingBackdrop() {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme.palette.mode === "dark";

  const purple = isDark ? "rgba(139, 92, 246, 0.28)" : "rgba(124, 58, 237, 0.2)";
  const cyan = isDark ? "rgba(56, 189, 248, 0.14)" : "rgba(3, 105, 161, 0.14)";
  const violet = isDark ? "rgba(109, 40, 217, 0.2)" : "rgba(91, 33, 182, 0.12)";

  const drift = (duration: number, delay = 0) =>
    reduce
      ? {}
      : {
          animate: {
            y: [0, -20, 0],
            x: [0, 12, 0],
            scale: [1, 1.05, 1],
          },
          transition: {
            duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay,
          },
        };

  const pulse = reduce
    ? {}
    : {
        animate: { opacity: [0.45, 0.75, 0.45] },
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

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
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: "-18%",
          right: "-12%",
          width: "min(62vw, 520px)",
          aspectRatio: "1",
          borderRadius: "50%",
          background: purple,
          filter: "blur(72px)",
        }}
        {...drift(18, 0)}
      />
      <motion.div
        style={{
          position: "absolute",
          top: "32%",
          left: "-20%",
          width: "min(55vw, 420px)",
          aspectRatio: "1",
          borderRadius: "50%",
          background: cyan,
          filter: "blur(64px)",
        }}
        {...drift(22, 2)}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "-8%",
          right: "18%",
          width: "min(48vw, 360px)",
          aspectRatio: "1",
          borderRadius: "50%",
          background: violet,
          filter: "blur(56px)",
        }}
        {...drift(16, 1)}
      />
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.12), transparent 55%)"
            : "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.08), transparent 55%)",
        }}
        {...pulse}
      />
    </Box>
  );
}

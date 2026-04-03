"use client";

import { Box, Container, Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { LandingBackdrop } from "@/components/feedback/LandingBackdrop";
import { ThemeModeToggle } from "@/components/feedback/ThemeModeToggle";
import { SITE_NAME } from "@/helpers/site";
import { useTheme } from "@mui/material/styles";

export interface AuthPageLayoutProps {
  title: string;
  subtitle?: string;
  /** e.g. link to the other auth route */
  alternate?: { href: string; label: string };
  children: ReactNode;
}

export function AuthPageLayout({
  title,
  subtitle,
  alternate,
  children,
}: AuthPageLayoutProps) {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme.palette.mode === "dark";

  const paperBg = isDark
    ? `linear-gradient(155deg, ${alpha("#fff", 0.07)} 0%, ${alpha("#fff", 0.02)} 48%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
    : `linear-gradient(155deg, #FFFFFF 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`;

  const paperShadow = isDark
    ? `0 0 0 1px ${alpha("#fff", 0.04)}, 0 28px 72px -24px rgba(0,0,0,0.65), 0 0 80px -30px ${alpha(theme.palette.primary.main, 0.25)}`
    : `0 0 0 1px ${alpha("#0f172a", 0.06)}, 0 24px 56px -20px rgba(15,23,42,0.12), 0 0 60px -24px ${alpha(theme.palette.primary.main, 0.15)}`;

  return (
    <Stack
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 3, sm: 4 },
        overflow: "hidden",
      }}
    >
      <LandingBackdrop />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Stack gap={3}>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Box
                component={NextLink}
                href="/"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                <Box
                  sx={{
                    filter: isDark
                      ? "drop-shadow(0 0 20px rgba(139,92,246,0.35))"
                      : "drop-shadow(0 0 16px rgba(124,58,237,0.22))",
                  }}
                >
                  <BrandMark size={40} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700} letterSpacing="-0.02em">
                  {SITE_NAME}
                </Typography>
              </Box>
              <Box
                sx={{
                  borderRadius: 999,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.72),
                  backdropFilter: "blur(12px)",
                  px: 0.25,
                  boxShadow: (t) =>
                    `0 0 0 1px ${alpha(t.palette.common.white, t.palette.mode === "dark" ? 0.06 : 0)}`,
                }}
              >
                <ThemeModeToggle />
              </Box>
            </Stack>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 76, damping: 20, delay: 0.06 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: isDark ? alpha("#fff", 0.1) : alpha("#0f172a", 0.08),
                background: paperBg,
                backdropFilter: "blur(16px)",
                boxShadow: paperShadow,
              }}
            >
              <Stack gap={2.5}>
                <Stack gap={0.75}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "1.75rem" },
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      background: isDark
                        ? "linear-gradient(120deg, #FFFFFF 0%, #C4B5FD 70%)"
                        : "linear-gradient(120deg, #0F172A 0%, #5B21B6 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {title}
                  </Typography>
                  {subtitle ? (
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {subtitle}
                    </Typography>
                  ) : null}
                </Stack>

                {children}

                {alternate ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ pt: 0.5 }}>
                    <MuiLink
                      component={NextLink}
                      href={alternate.href}
                      fontWeight={600}
                      underline="hover"
                      sx={{ color: "primary.main" }}
                    >
                      {alternate.label}
                    </MuiLink>
                  </Typography>
                ) : null}
              </Stack>
            </Paper>
          </motion.div>
        </Stack>
      </Container>
    </Stack>
  );
}

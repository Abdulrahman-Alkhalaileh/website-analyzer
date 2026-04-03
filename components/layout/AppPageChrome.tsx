"use client";

import { AuthorWatermark } from "@/components/layout/AuthorWatermark";
import { LandingBackdrop } from "@/components/feedback/LandingBackdrop";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { Container, Stack } from "@mui/material";
import type { ReactNode } from "react";

export type AppPageChromeProps = {
  children: ReactNode;
  /**
   * Gradient orbs + grid (landing aesthetic). On the audit page this is off once
   * results are shown so the report stays readable.
   */
  showAmbient?: boolean;
};

/**
 * Shared shell: full-height background, optional ambient backdrop, top bar, max-width
 * content column, footer credits. Used by `/` (audit UI) and `/dashboard`.
 */
export function AppPageChrome({
  children,
  showAmbient = true,
}: AppPageChromeProps) {
  return (
    <Stack
      component="main"
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, md: 6 },
        overflow: "hidden",
      }}
    >
      {showAmbient ? <LandingBackdrop /> : null}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack gap={6}>
          <AppTopBar />
          {children}
          <AuthorWatermark />
        </Stack>
      </Container>
    </Stack>
  );
}

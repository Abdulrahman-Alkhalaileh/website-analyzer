"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useLayoutEffect, useMemo } from "react";
import { createAppTheme } from "@/components/theme";
import { useThemeModeStore } from "@/stores/theme-mode-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const mode = useThemeModeStore((s) => s.mode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}

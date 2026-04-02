"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "@/components/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

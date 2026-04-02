"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    score: {
      good: string;
      medium: string;
      poor: string;
    };
  }
  interface PaletteOptions {
    score?: {
      good: string;
      medium: string;
      poor: string;
    };
  }
}

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0B0B0B",
      paper: "#141414",
    },
    primary: {
      main: "#8B5CF6",
      light: "#A78BFA",
      dark: "#6D28D9",
    },
    secondary: {
      main: "#38BDF8",
    },
    success: {
      main: "#22C55E",
    },
    warning: {
      main: "#F97316",
    },
    error: {
      main: "#EF4444",
    },
    divider: "rgba(255,255,255,0.08)",
    text: {
      primary: "rgba(255,255,255,0.92)",
      secondary: "rgba(255,255,255,0.62)",
    },
    score: {
      good: "#22C55E",
      medium: "#F97316",
      poor: "#EF4444",
    },
  },
  typography: {
    fontFamily:
      'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 22,
          paddingBlock: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
  },
});

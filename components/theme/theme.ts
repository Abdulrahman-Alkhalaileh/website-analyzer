import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "@/stores/theme-mode-store";

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

const typography = {
  fontFamily:
    'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
  h1: { fontWeight: 700, letterSpacing: "-0.03em" },
  h2: { fontWeight: 700, letterSpacing: "-0.02em" },
  h3: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  button: { textTransform: "none" as const, fontWeight: 600 },
};

const components = {
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
    defaultProps: { variant: "outlined" as const },
  },
};

function paletteForMode(mode: ThemeMode) {
  if (mode === "dark") {
    return {
      mode: "dark" as const,
      background: {
        default: "#0B0B0B",
        paper: "#141414",
      },
      primary: {
        main: "#8B5CF6",
        light: "#A78BFA",
        dark: "#6D28D9",
      },
      secondary: { main: "#38BDF8" },
      success: { main: "#22C55E" },
      warning: { main: "#F97316" },
      error: { main: "#EF4444" },
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
    };
  }

  return {
    mode: "light" as const,
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#7C3AED",
      light: "#8B5CF6",
      dark: "#5B21B6",
    },
    secondary: { main: "#0369A1" },
    success: { main: "#16A34A" },
    warning: { main: "#EA580C" },
    error: { main: "#DC2626" },
    divider: "rgba(15, 23, 42, 0.12)",
    text: {
      primary: "rgba(15, 23, 42, 0.92)",
      secondary: "rgba(15, 23, 42, 0.62)",
    },
    score: {
      good: "#16A34A",
      medium: "#EA580C",
      poor: "#DC2626",
    },
  };
}

export function createAppTheme(mode: ThemeMode) {
  return createTheme({
    palette: paletteForMode(mode),
    typography,
    shape: {
      borderRadius: 14,
    },
    components,
  });
}

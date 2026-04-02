"use client";

import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useThemeModeStore } from "@/stores/theme-mode-store";

export function ThemeModeToggle() {
  const mode = useThemeModeStore((s) => s.mode);
  const toggleMode = useThemeModeStore((s) => s.toggleMode);
  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        size="medium"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
      </IconButton>
    </Tooltip>
  );
}

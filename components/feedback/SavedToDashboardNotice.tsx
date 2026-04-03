"use client";

import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import CloseRounded from "@mui/icons-material/CloseRounded";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import UnfoldLessRounded from "@mui/icons-material/UnfoldLessRounded";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Link from "next/link";
import type { FC } from "react";

export type SavedToDashboardNoticeProps = {
  /** When false, nothing is rendered. */
  open: boolean;
  minimized: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  onDismiss: () => void;
};

export const SavedToDashboardNotice: FC<SavedToDashboardNoticeProps> = ({
  open,
  minimized,
  onMinimize,
  onExpand,
  onDismiss,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!open) return null;

  const shellSx = {
    position: "fixed" as const,
    zIndex: theme.zIndex.snackbar,
    right: { xs: 16, sm: 24 },
    bottom: { xs: 16, sm: 24 },
    maxWidth: "min(calc(100vw - 32px), 360px)",
  };

  const paperBg = isDark
    ? `linear-gradient(150deg, ${alpha("#fff", 0.09)} 0%, ${alpha("#fff", 0.04)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
    : `linear-gradient(150deg, #fff 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`;

  if (minimized) {
    return (
      <Box sx={shellSx}>
        <Paper
          elevation={0}
          onClick={onExpand}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onExpand();
            }
          }}
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: 999,
            border: 1,
            borderColor: "divider",
            backdropFilter: "blur(14px)",
            background: paperBg,
            boxShadow: isDark
              ? `0 8px 32px -8px rgba(0,0,0,0.65), 0 0 0 1px ${alpha("#fff", 0.06)}`
              : `0 8px 28px -10px rgba(15,23,42,0.2)`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CheckCircleOutline
            sx={{ fontSize: 20, color: "success.main", flexShrink: 0 }}
            aria-hidden
          />
          <Typography variant="body2" fontWeight={700} sx={{ pr: 0.5 }}>
            Saved to dashboard
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "inline" } }}>
            Click to expand
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={shellSx}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2.5,
          border: 1,
          borderColor: "divider",
          backdropFilter: "blur(14px)",
          background: paperBg,
          boxShadow: isDark
            ? `0 12px 40px -12px rgba(0,0,0,0.7), 0 0 0 1px ${alpha("#fff", 0.06)}`
            : `0 12px 36px -14px rgba(15,23,42,0.18)`,
        }}
      >
        <Stack gap={1.5}>
          <Stack direction="row" alignItems="flex-start" gap={1}>
            <CheckCircleOutline
              sx={{
                fontSize: 28,
                color: "success.main",
                flexShrink: 0,
                mt: 0.25,
              }}
              aria-hidden
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={800} letterSpacing="-0.02em">
                Audit saved
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, lineHeight: 1.55 }}>
                This run is in your dashboard so you can reopen it anytime.
              </Typography>
            </Box>
            <IconButton
              size="small"
              aria-label="Dismiss"
              onClick={onDismiss}
              sx={{ mt: -0.5, mr: -0.5 }}
            >
              <CloseRounded fontSize="small" />
            </IconButton>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="small"
              startIcon={<DashboardOutlined />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Open dashboard
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<UnfoldLessRounded />}
              onClick={onMinimize}
              sx={{ fontWeight: 600 }}
            >
              Minimize
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

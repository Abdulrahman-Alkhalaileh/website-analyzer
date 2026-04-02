"use client";

import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

export interface NewAuditConfirmDialogProps {
  open: boolean;
  analyzedUrl: string | null;
  onClose: () => void;
  /** Called after user confirms; parent should clear audit state. */
  onConfirm: () => void;
}

export function NewAuditConfirmDialog({
  open,
  analyzedUrl,
  onClose,
  onConfirm,
}: NewAuditConfirmDialogProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="new-audit-dialog-title"
      aria-describedby="new-audit-dialog-desc"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: isDark
              ? alpha("#000000", 0.72)
              : alpha("#0f172a", 0.36),
            backdropFilter: isDark ? "blur(10px)" : "blur(14px)",
          },
        },
      }}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.94, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { type: "spring", stiffness: 320, damping: 28 },
        sx: {
          borderRadius: 3,
          border: 1,
          borderColor: isDark ? alpha("#fff", 0.1) : alpha("#fff", 0.72),
          background: isDark
            ? `linear-gradient(155deg, ${alpha("#fff", 0.08)} 0%, ${alpha(
                "#fff",
                0.02
              )} 40%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
            : `linear-gradient(155deg, ${alpha("#fff", 0.58)} 0%, ${alpha(
                "#fff",
                0.28
              )} 42%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`,
          backdropFilter: isDark ? "blur(20px)" : "blur(24px) saturate(1.15)",
          boxShadow: isDark
            ? `0 0 0 1px ${alpha(
                "#fff",
                0.05
              )}, 0 28px 80px -20px rgba(0,0,0,0.65), 0 0 60px -20px ${alpha(
                theme.palette.primary.main,
                0.25
              )}`
            : `0 0 0 1px ${alpha("#fff", 0.55)}, 0 0 0 1px ${alpha("#0f172a", 0.06)} inset, 0 20px 48px -12px ${alpha("#0f172a", 0.12)}, 0 0 48px -14px ${alpha(theme.palette.primary.main, 0.22)}`,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ pt: 3, pb: 1, px: { xs: 2.5, sm: 3 } }}>
        <Stack direction="row" gap={2} alignItems="flex-start">
          <Stack gap={1.25} sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" gap={1.25}>
              <Box
                sx={{
                  flexShrink: 0,
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.warning.main,
                    isDark ? 0.25 : 0.18
                  )} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                  border: 1,
                  borderColor: alpha(theme.palette.warning.main, 0.35),
                  boxShadow: `0 0 24px ${alpha(
                    theme.palette.warning.main,
                    0.2
                  )}`,
                }}
              >
                <WarningAmberRounded
                  sx={{
                    fontSize: 30,
                    color: "warning.main",
                    filter: isDark
                      ? "drop-shadow(0 0 8px rgba(251,191,36,0.4))"
                      : "none",
                  }}
                />
              </Box>
              <Typography
                id="new-audit-dialog-title"
                variant="h6"
                component="h2"
                fontWeight={700}
                letterSpacing="-0.02em"
                sx={{
                  background: isDark
                    ? "linear-gradient(120deg, #fff 0%, #fde68a 55%)"
                    : "linear-gradient(120deg, #0f172a 0%, #b45309 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Start a new audit?
              </Typography>
            </Stack>
            <Typography
              id="new-audit-dialog-desc"
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.65 }}
            >
              Your current Lighthouse run, scores, filmstrip, metrics, and issue
              list live only in this session. Starting over{" "}
              <Typography
                component="span"
                variant="body2"
                fontWeight={700}
                color="text.primary"
              >
                clears all of that
              </Typography>
              —you&apos;ll need to analyze again to get them back.
            </Typography>
            {analyzedUrl ? (
              <Box
                sx={{
                  mt: 0.5,
                  py: 1,
                  px: 1.5,
                  borderRadius: 1.5,
                  bgcolor: alpha(
                    theme.palette.text.primary,
                    isDark ? 0.06 : 0.04
                  ),
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  gutterBottom
                >
                  Current page
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ wordBreak: "break-all", lineHeight: 1.5 }}
                >
                  {analyzedUrl}
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3 },
          pb: 2.5,
          pt: 1,
          gap: 1.5,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          size="large"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            borderWidth: 2,
            "&:hover": { borderWidth: 2 },
          }}
        >
          Keep results
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={onConfirm}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            px: 2.5,
            boxShadow: (t) =>
              `0 0 24px ${alpha(
                t.palette.primary.main,
                0.35
              )}, 0 8px 20px ${alpha(t.palette.primary.main, 0.2)}`,
            "&:hover": {
              boxShadow: (t) =>
                `0 0 32px ${alpha(
                  t.palette.primary.main,
                  0.45
                )}, 0 10px 24px ${alpha(t.palette.primary.main, 0.25)}`,
            },
          }}
        >
          Clear &amp; start over
        </Button>
      </DialogActions>
    </Dialog>
  );
}

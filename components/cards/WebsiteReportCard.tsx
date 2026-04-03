"use client";

import ComputerIcon from "@mui/icons-material/Computer";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, type FC } from "react";
import type { ScoreBand } from "@/helpers/audit";
import type { ReportRow } from "@/helpers/dashboard-domain";
import { normalizeImageDataUrl } from "@/helpers/image";

export type WebsiteReportCardProps = {
  domainKey: string;
  displayLabel: string;
  reports: ReportRow[];
};

function scoreBand(score: number): ScoreBand {
  if (score >= 90) return "good";
  if (score >= 50) return "medium";
  return "poor";
}

export const WebsiteReportCard: FC<WebsiteReportCardProps> = ({
  displayLabel,
  reports,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [dialogOpen, setDialogOpen] = useState(false);

  const newest = reports[0];
  const mobileCount = reports.filter(
    (r) => r.device?.toLowerCase() === "mobile"
  ).length;
  const desktopCount = reports.filter(
    (r) => r.device?.toLowerCase() !== "mobile"
  ).length;

  const previewReport =
    reports.find((r) => r.image?.trim()) ?? newest ?? null;
  const safeSrc = previewReport?.image?.trim()
    ? normalizeImageDataUrl(previewReport.image)
    : "";

  const latestScore = newest != null && Number.isFinite(newest.score)
    ? Math.round(newest.score)
    : null;
  const band = latestScore != null ? scoreBand(latestScore) : "medium";
  const scoreColor =
    band === "good"
      ? theme.palette.score.good
      : band === "medium"
        ? theme.palette.score.medium
        : theme.palette.score.poor;

  const paperBg = isDark
    ? `linear-gradient(155deg, ${alpha("#fff", 0.07)} 0%, ${alpha("#fff", 0.02)} 48%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
    : `linear-gradient(155deg, #FFFFFF 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`;

  const sampleUrl = newest?.url ?? "";

  return (
    <>
      <Paper
        component={motion.div}
        elevation={0}
        role="button"
        tabIndex={0}
        onClick={() => setDialogOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDialogOpen(true);
          }
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
        whileHover={{ y: -4, transition: { duration: 0.22 } }}
        sx={{
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: isDark ? alpha("#fff", 0.1) : alpha("#0f172a", 0.08),
          background: paperBg,
          backdropFilter: "blur(16px)",
          overflow: "hidden",
          cursor: "pointer",
          outline: "none",
          boxShadow: isDark
            ? `0 0 0 1px ${alpha("#fff", 0.04)}, 0 18px 44px -20px rgba(0,0,0,0.55)`
            : `0 0 0 1px ${alpha("#0f172a", 0.06)}, 0 16px 40px -18px rgba(15,23,42,0.12)`,
          maxWidth: 380,
          width: "100%",
          "&:focus-visible": {
            boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}`,
          },
        }}
      >
        <Stack>
          <Box
            sx={{
              position: "relative",
              height: 132,
              bgcolor: isDark ? alpha("#fff", 0.04) : alpha("#0f172a", 0.04),
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            {safeSrc ? (
              <Box
                component="img"
                src={safeSrc}
                alt=""
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%", color: "text.secondary", opacity: 0.65 }}
              >
                <ImageOutlined sx={{ fontSize: 40 }} />
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  No preview
                </Typography>
              </Stack>
            )}
            <Chip
              size="small"
              icon={<HistoryOutlined sx={{ fontSize: 16 }} />}
              label={`${reports.length} audit${reports.length === 1 ? "" : "s"}`}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                fontWeight: 700,
                backdropFilter: "blur(8px)",
                bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
                border: 1,
                borderColor: "divider",
              }}
            />
          </Box>

          <Stack sx={{ p: 2, pt: 2.25 }} gap={1.5}>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={1}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  letterSpacing="-0.02em"
                  sx={{ lineHeight: 1.25 }}
                  title={sampleUrl}
                >
                  {displayLabel}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tap to see all runs & open audits
                </Typography>
              </Box>
              {latestScore != null ? (
                <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                  <Typography
                    variant="h4"
                    component="span"
                    fontWeight={800}
                    sx={{
                      color: scoreColor,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {latestScore}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    latest
                  </Typography>
                </Stack>
              ) : null}
            </Stack>

            <Stack direction="row" gap={0.75} flexWrap="wrap">
              {desktopCount > 0 ? (
                <Chip
                  size="small"
                  icon={<ComputerIcon sx={{ fontSize: 16 }} />}
                  label={`${desktopCount} desktop`}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              ) : null}
              {mobileCount > 0 ? (
                <Chip
                  size="small"
                  icon={<SmartphoneIcon sx={{ fontSize: 16 }} />}
                  label={`${mobileCount} mobile`}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="website-runs-dialog-title"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              border: 1,
              borderColor: "divider",
            },
          },
        }}
      >
        <DialogTitle
          id="website-runs-dialog-title"
          sx={{
            pr: 6,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">
              {displayLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {reports.length} saved audit{reports.length === 1 ? "" : "s"} ·
              newest first
            </Typography>
          </Box>
          <IconButton
            aria-label="Close"
            onClick={() => setDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Device</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((r) => {
                const isMobile = r.device?.toLowerCase() === "mobile";
                return (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {new Date(r.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={
                          isMobile ? (
                            <SmartphoneIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <ComputerIcon sx={{ fontSize: 16 }} />
                          )
                        }
                        label={isMobile ? "Mobile" : "Desktop"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {Number.isFinite(r.score) ? Math.round(r.score) : "—"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={Link}
                        href={`/?report=${r.id}`}
                        size="small"
                        variant="contained"
                        endIcon={<OpenInNewOutlined sx={{ fontSize: 16 }} />}
                        onClick={() => setDialogOpen(false)}
                        sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                      >
                        Open audit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            Opens your saved audit on the home page (restored from your dashboard).
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebsiteReportCard;

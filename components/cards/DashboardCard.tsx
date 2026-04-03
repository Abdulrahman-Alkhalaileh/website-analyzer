"use client";

import ComputerIcon from "@mui/icons-material/Computer";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import type { FC } from "react";
import type { ScoreBand } from "@/helpers/audit";
import { normalizeImageDataUrl } from "@/helpers/image";

export type DashboardCardProps = {
  id?: string;
  url: string;
  score: number;
  device: string;
  created_at: string;
  image?: string | null;
};

function hostLabel(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./i, "");
  } catch {
    return url.length > 48 ? `${url.slice(0, 45)}…` : url;
  }
}

function scoreBand(score: number): ScoreBand {
  if (score >= 90) return "good";
  if (score >= 50) return "medium";
  return "poor";
}

const DashboardCard: FC<DashboardCardProps> = ({
  id,
  url,
  score,
  device,
  created_at,
  image,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const band = scoreBand(score);
  const scoreColor =
    band === "good"
      ? theme.palette.score.good
      : band === "medium"
        ? theme.palette.score.medium
        : theme.palette.score.poor;

  const isMobile = device?.toLowerCase() === "mobile";
  const safeSrc = image?.trim()
    ? normalizeImageDataUrl(image)
    : "";

  const paperBg = isDark
    ? `linear-gradient(155deg, ${alpha("#fff", 0.07)} 0%, ${alpha("#fff", 0.02)} 48%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
    : `linear-gradient(155deg, #FFFFFF 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`;

  const formattedDate = (() => {
    try {
      return new Date(created_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return created_at;
    }
  })();

  return (
    <Paper
      component={motion.div}
      elevation={0}
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
        boxShadow: isDark
          ? `0 0 0 1px ${alpha("#fff", 0.04)}, 0 18px 44px -20px rgba(0,0,0,0.55)`
          : `0 0 0 1px ${alpha("#0f172a", 0.06)}, 0 16px 40px -18px rgba(15,23,42,0.12)`,
        maxWidth: 360,
        width: "100%",
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
            icon={isMobile ? <SmartphoneIcon /> : <ComputerIcon />}
            label={isMobile ? "Mobile" : "Desktop"}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              fontWeight: 700,
              backdropFilter: "blur(8px)",
              bgcolor: (t) => alpha(t.palette.background.paper, 0.88),
              border: 1,
              borderColor: "divider",
            }}
          />
        </Box>

        <Stack sx={{ p: 2, pt: 2.25 }} gap={1.75}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                letterSpacing="-0.02em"
                sx={{
                  lineHeight: 1.25,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={url}
              >
                {hostLabel(url)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.35,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={url}
              >
                {url}
              </Typography>
            </Box>
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
                {Number.isFinite(score) ? Math.round(score) : "—"}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                score
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.9 }}>
            {formattedDate}
          </Typography>

          {id ? (
            <Button
              component={Link}
              href={`/?report=${id}`}
              size="medium"
              variant="outlined"
              endIcon={<OpenInNewOutlined sx={{ fontSize: 18 }} />}
              sx={{
                mt: 0.25,
                fontWeight: 700,
                borderRadius: 2,
                borderWidth: 2,
                "&:hover": { borderWidth: 2 },
              }}
            >
              Open full audit
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DashboardCard;

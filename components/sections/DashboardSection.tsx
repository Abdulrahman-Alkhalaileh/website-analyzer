"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { DashboardSeverity } from "@/helpers/severity";
import { dashboardSeverityToInsight, insightLabel } from "@/helpers/severity";

export interface DashboardSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  severity?: DashboardSeverity;
  defaultExpanded?: boolean;
  helpText?: string;
  learnMoreHref?: string;
  learnMoreLabel?: string;
  children: React.ReactNode;
}

export function DashboardSection({
  id,
  title,
  subtitle,
  severity = "neutral",
  defaultExpanded = true,
  helpText,
  learnMoreHref,
  learnMoreLabel = "Learn more",
  children,
}: DashboardSectionProps) {
  const insight = dashboardSeverityToInsight(severity);

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      id={`section-${id}`}
      sx={(t) => {
        const isDark = t.palette.mode === "dark";
        const neutralBg = isDark
          ? alpha(t.palette.common.white, 0.04)
          : alpha(t.palette.common.black, 0.03);
        return {
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          borderLeftWidth: 4,
          borderLeftColor:
            severity === "error"
              ? "error.main"
              : severity === "warning"
                ? "warning.main"
                : severity === "success"
                  ? "success.main"
                  : severity === "info"
                    ? "secondary.main"
                    : t.palette.divider,
          bgcolor:
            severity === "error"
              ? alpha(t.palette.error.main, isDark ? 0.12 : 0.08)
              : severity === "warning"
                ? alpha(t.palette.warning.main, isDark ? 0.12 : 0.08)
                : severity === "success"
                  ? alpha(t.palette.success.main, isDark ? 0.12 : 0.08)
                  : severity === "info"
                    ? alpha(t.palette.secondary.main, isDark ? 0.1 : 0.08)
                    : neutralBg,
          boxShadow: isDark
            ? `0 1px 0 ${alpha("#fff", 0.04)} inset`
            : `0 1px 0 ${alpha("#fff", 0.9)} inset`,
          "&:before": { display: "none" },
          overflow: "hidden",
        };
      }}
    >
      <AccordionSummary
        expandIcon={
          <Typography
            aria-hidden
            component="span"
            sx={{ color: "text.secondary", fontSize: "0.85rem", lineHeight: 1 }}
          >
            ▼
          </Typography>
        }
        aria-controls={`${id}-content`}
        id={`${id}-header`}
        sx={{
          px: 2,
          py: 1.5,
          "& .MuiAccordionSummary-content": { my: 0.5, gap: 1, alignItems: "center" },
        }}
      >
        <Stack direction="row" alignItems="flex-start" gap={1} flex={1} flexWrap="wrap">
          <Stack gap={0.25} flex={1} minWidth={0}>
            <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight={700}>
                {title}
              </Typography>
              {severity !== "neutral" ? (
                <Chip
                  size="small"
                  label={insightLabel(insight)}
                  color={
                    severity === "error"
                      ? "error"
                      : severity === "warning"
                        ? "warning"
                        : severity === "success"
                          ? "success"
                          : "info"
                  }
                  variant="outlined"
                  sx={{ height: 22, fontSize: "0.7rem" }}
                />
              ) : null}
              {helpText ? (
                <Tooltip title={helpText} arrow placement="top" enterTouchDelay={0}>
                  <Typography
                    component="span"
                    role="button"
                    tabIndex={0}
                    aria-label={`About: ${title}`}
                    sx={{
                      cursor: "help",
                      color: "secondary.light",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    ?
                  </Typography>
                </Tooltip>
              ) : null}
            </Stack>
            {subtitle ? (
              <Typography variant="caption" color="text.secondary" sx={{ pr: 1 }}>
                {subtitle}
              </Typography>
            ) : null}
            {learnMoreHref ? (
              <Link
                href={learnMoreHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
                sx={{ display: "inline-block", fontWeight: 600, mt: 0.25, width: "fit-content" }}
              >
                {learnMoreLabel} ↗
              </Link>
            ) : null}
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
        <Stack gap={2}>{children}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}

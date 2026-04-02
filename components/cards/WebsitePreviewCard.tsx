"use client";

import { Chip, Link, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { FilmstripFrame, LabStrategy } from "@/helpers/audit";
import { LINKS } from "@/helpers/doc-links";
import { formatMs } from "@/helpers/lighthouse-extract";

export interface WebsitePreviewCardProps {
  labStrategy: LabStrategy;
  filmstripFrames: FilmstripFrame[];
  fullPageSrc: string | null;
  finalScreenshotSrc: string | null;
  siteLabel: string | null;
  embedded?: boolean;
}

export function WebsitePreviewCard({
  labStrategy,
  filmstripFrames,
  fullPageSrc,
  finalScreenshotSrc,
  siteLabel,
  embedded,
}: WebsitePreviewCardProps) {
  const showFinal =
    Boolean(finalScreenshotSrc) &&
    finalScreenshotSrc !== fullPageSrc;

  if (!fullPageSrc && filmstripFrames.length === 0 && !finalScreenshotSrc) {
    return null;
  }

  const header = embedded ? (
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
      <Stack gap={0.5}>
        {siteLabel ? (
          <Typography variant="body2" color="text.secondary">
            {siteLabel}
          </Typography>
        ) : null}
        <Typography variant="caption" color="text.secondary">
          Filmstrip docs:{" "}
          <Link href={LINKS.lighthouseOverview} target="_blank" rel="noopener noreferrer" variant="caption">
            Lighthouse ↗
          </Link>
        </Typography>
      </Stack>
      <Chip
        label={labStrategy === "mobile" ? "Lab: Mobile" : "Lab: Desktop"}
        color="primary"
        variant="outlined"
        sx={{ fontWeight: 700 }}
      />
    </Stack>
  ) : (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
    >
      <Stack gap={0.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          Visual capture
        </Typography>
        {siteLabel ? (
          <Typography variant="body2" color="text.secondary">
            {siteLabel}
          </Typography>
        ) : null}
        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 560 }}>
          Timeline frames come from Lighthouse’s{" "}
          <Typography component="span" variant="caption" fontWeight={600}>
            screenshot-thumbnails
          </Typography>{" "}
          filmstrip—the same progressive shots PageSpeed shows. The tall image is a{" "}
          <Typography component="span" variant="caption" fontWeight={600}>
            full-page
          </Typography>{" "}
          capture (entire scroll height), so it will look “long” compared to the viewport
          frames.{" "}
          <Link href={LINKS.lighthouseOverview} target="_blank" rel="noopener noreferrer" variant="caption">
            Read more ↗
          </Link>
        </Typography>
      </Stack>
      <Chip
        label={labStrategy === "mobile" ? "Lab: Mobile" : "Lab: Desktop"}
        color="primary"
        variant="outlined"
        sx={{ fontWeight: 700 }}
      />
    </Stack>
  );

  const body = (
    <Stack gap={2.5}>
      {header}

        {filmstripFrames.length > 0 ? (
          <Stack gap={1}>
            <Typography variant="overline" color="primary.light" fontWeight={700}>
              Load timeline
            </Typography>
            <Stack
              direction="row"
              gap={1.5}
              sx={{
                overflowX: "auto",
                overflowY: "hidden",
                pb: 1,
                mx: -0.5,
                px: 0.5,
                scrollSnapType: "x mandatory",
              }}
            >
              {filmstripFrames.map((frame) => (
                <Stack
                  key={frame.index}
                  gap={0.5}
                  sx={{
                    flexShrink: 0,
                    width: 112,
                    scrollSnapAlign: "start",
                  }}
                >
                  <Stack
                    component="img"
                    src={frame.src}
                    alt={`Load at about ${formatMs(frame.timingMs)}`}
                    sx={{
                      width: 112,
                      height: 84,
                      objectFit: "cover",
                      objectPosition: "top center",
                      borderRadius: 1,
                      border: 1,
                      borderColor: "divider",
                      bgcolor: "rgba(0,0,0,0.4)",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ fontFeatureSettings: '"tnum"' }}
                  >
                    ~{formatMs(frame.timingMs)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ) : null}

        {showFinal && finalScreenshotSrc ? (
          <Stack gap={1}>
            <Typography variant="overline" color="secondary.light" fontWeight={700}>
              Final viewport
            </Typography>
            <Stack
              alignItems="center"
              sx={{
                bgcolor: "rgba(0,0,0,0.35)",
                borderRadius: 2,
                p: 1,
              }}
            >
              <Stack
                component="img"
                src={finalScreenshotSrc}
                alt="Final viewport screenshot from Lighthouse"
                sx={{
                  display: "block",
                  maxWidth: "100%",
                  width: labStrategy === "mobile" ? 420 : "100%",
                  height: "auto",
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: "divider",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
                }}
              />
            </Stack>
          </Stack>
        ) : null}

        {fullPageSrc ? (
          <Stack gap={1}>
            <Typography variant="overline" color="text.secondary" fontWeight={700}>
              Full-page screenshot
            </Typography>
            <Stack
              alignItems="center"
              sx={{
                bgcolor: "rgba(0,0,0,0.35)",
                borderRadius: 2,
                p: 1,
                maxHeight: { xs: 480, sm: 640 },
                overflow: "auto",
              }}
            >
              <Stack
                component="img"
                src={fullPageSrc}
                alt="Full scroll height capture from Lighthouse"
                sx={{
                  display: "block",
                  width: "100%",
                  maxWidth: labStrategy === "mobile" ? 420 : "100%",
                  height: "auto",
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: "divider",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
                }}
              />
            </Stack>
          </Stack>
        ) : null}
    </Stack>
  );

  if (embedded) return body;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: (t) => `0 24px 48px -12px ${t.palette.common.black}88`,
      }}
    >
      {body}
    </Paper>
  );
}

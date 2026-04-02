"use client";

import {
  Button,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import type { LabStrategy } from "@/helpers/audit";

export interface LandingHeroProps {
  url: string;
  onUrlChange: (value: string) => void;
  strategy: LabStrategy;
  onStrategyChange: (value: LabStrategy) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string | null;
}

export function LandingHero({
  url,
  onUrlChange,
  strategy,
  onStrategyChange,
  onAnalyze,
  loading,
  error,
}: LandingHeroProps) {
  return (
    <Stack
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      gap={3}
    >
      <Typography
        variant="h3"
        component="h2"
        sx={{ fontSize: { xs: "1.85rem", md: "2.5rem" } }}
      >
        See what&apos;s slowing your site down
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        Paste any public URL. We run Google PageSpeed Insights and translate the
        results into clear scores, previews, and plain-language fixes—no jargon.
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack gap={2}>
          <Stack gap={1}>
            <Typography variant="body2" fontWeight={600}>
              Lab device
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Matches PageSpeed&apos;s{" "}
              <Typography component="span" variant="caption" fontWeight={600}>
                strategy
              </Typography>{" "}
              parameter. Mobile and desktop are separate Lighthouse runs (not the same
              screenshot resized).
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={strategy}
              onChange={(_, v: LabStrategy | null) => v && onStrategyChange(v)}
              disabled={loading}
              size="small"
              aria-label="PageSpeed strategy"
            >
              <ToggleButton value="mobile">Mobile</ToggleButton>
              <ToggleButton value="desktop">Desktop</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <TextField
            fullWidth
            label="Website URL"
            placeholder="https://yoursite.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && onAnalyze()}
            error={Boolean(error)}
            helperText={error || undefined}
            disabled={loading}
            slotProps={{ htmlInput: { "aria-label": "Website URL" } }}
          />
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={onAnalyze}
              disabled={loading}
              sx={{
                boxShadow: (t) => `0 0 24px ${t.palette.primary.main}44`,
                "&:hover": {
                  boxShadow: (t) => `0 0 32px ${t.palette.primary.main}66`,
                },
              }}
            >
              Analyze
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

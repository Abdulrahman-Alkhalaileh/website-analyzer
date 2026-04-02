"use client";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "@/components/brand/BrandMark";
import type { LabStrategy } from "@/helpers/audit";
import ComputerIcon from "@mui/icons-material/Computer";
import SmartphoneIcon from "@mui/icons-material/Smartphone";

export interface LandingHeroProps {
  url: string;
  onUrlChange: (value: string) => void;
  strategy: LabStrategy;
  onStrategyChange: (value: LabStrategy) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string | null;
}

const spring = {
  type: "spring" as const,
  stiffness: 76,
  damping: 20,
  mass: 0.9,
};

const rootVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.07 },
  },
};

export function LandingHero({
  url,
  onUrlChange,
  strategy,
  onStrategyChange,
  onAnalyze,
  loading,
  error,
}: LandingHeroProps) {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme.palette.mode === "dark";

  const headlineGradient = isDark
    ? "linear-gradient(120deg, #FFFFFF 0%, rgba(255,255,255,0.88) 35%, #C4B5FD 75%, #A78BFA 100%)"
    : "linear-gradient(120deg, #0F172A 0%, #334155 40%, #5B21B6 85%)";

  const item = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.28 } },
      }
    : {
        hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: spring,
        },
      };

  const logoSpring = reduce
    ? item
    : {
        hidden: { opacity: 0, scale: 0.88, rotate: -5 },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: { ...spring, stiffness: 95 },
        },
      };

  return (
    <motion.div
      variants={rootVariants}
      initial="hidden"
      animate="visible"
      style={{ width: "100%" }}
    >
      <Stack gap={{ xs: 3, md: 3.5 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          gap={{ xs: 2, sm: 2.5 }}
          component={motion.div}
          variants={reduce ? item : logoSpring}
        >
          <Box
            sx={{
              flexShrink: 0,
              pt: { xs: 0.25, md: 0.5 },
              filter: isDark
                ? "drop-shadow(0 0 28px rgba(139,92,246,0.35))"
                : "drop-shadow(0 0 20px rgba(124,58,237,0.25))",
            }}
          >
            <BrandMark size={52} />
          </Box>
          <Stack gap={1.25} sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              variant="h3"
              sx={{
                fontSize: { xs: "1.95rem", sm: "2.25rem", md: "2.75rem" },
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.12,
                background: headlineGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              See what&apos;s slowing your site down
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.75,
                fontSize: { xs: "1rem", md: "1.0625rem" },
                maxWidth: 540,
              }}
            >
              Paste any public URL. We run Google PageSpeed Insights and
              translate the results into clear scores, previews, and
              plain-language fixes—no jargon.
            </Typography>
          </Stack>
        </Stack>

        <Box component={motion.div} variants={item}>
          <motion.div
            whileHover={
              reduce
                ? undefined
                : {
                    y: -3,
                    transition: { type: "spring", stiffness: 380, damping: 26 },
                  }
            }
            style={{ borderRadius: 20 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.25, sm: 2.75 },
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: isDark
                  ? alpha("#fff", 0.1)
                  : alpha("#0f172a", 0.08),
                background: isDark
                  ? `linear-gradient(155deg, ${alpha("#fff", 0.07)} 0%, ${alpha(
                      "#fff",
                      0.02
                    )} 48%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
                  : `linear-gradient(155deg, #FFFFFF 0%, ${alpha(
                      theme.palette.primary.main,
                      0.04
                    )} 100%)`,
                backdropFilter: "blur(16px)",
                boxShadow: isDark
                  ? `0 0 0 1px ${alpha(
                      "#fff",
                      0.04
                    )}, 0 28px 72px -24px rgba(0,0,0,0.65), 0 0 80px -30px ${alpha(
                      theme.palette.primary.main,
                      0.25
                    )}`
                  : `0 0 0 1px ${alpha(
                      "#0f172a",
                      0.06
                    )}, 0 24px 56px -20px rgba(15,23,42,0.12), 0 0 60px -24px ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
              }}
            >
              <Stack gap={2.25}>
                <Stack gap={1}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    letterSpacing="0.02em"
                  >
                    Lab device
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1.65 }}
                  >
                    Matches PageSpeed&apos;s{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      fontWeight={600}
                    >
                      strategy
                    </Typography>{" "}
                    parameter. Mobile and desktop are separate Lighthouse runs
                    (not the same screenshot resized).
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    value={strategy}
                    onChange={(_, v: LabStrategy | null) =>
                      v && onStrategyChange(v)
                    }
                    disabled={loading}
                    size="small"
                    aria-label="PageSpeed strategy"
                    sx={{
                      alignSelf: "flex-start",
                      p: 0.5,
                      borderRadius: 2,
                      bgcolor: isDark
                        ? alpha("#fff", 0.04)
                        : alpha("#0f172a", 0.04),
                      gap: 0.5,
                      "& .MuiToggleButton-root": {
                        px: 2,
                        py: 0.75,
                        border: "none",
                        borderRadius: 1.5,
                        typography: "body2",
                        fontWeight: 600,
                        textTransform: "none",
                        transition: "all 0.2s ease",
                        "&.Mui-selected": {
                          bgcolor: alpha(
                            theme.palette.primary.main,
                            isDark ? 0.28 : 0.18
                          ),
                          color: isDark ? "#fff" : theme.palette.primary.dark,
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.35
                          )}`,
                        },
                      },
                    }}
                  >
                    <ToggleButton value="desktop">
                      <ComputerIcon fontSize="small" sx={{ mr: 0.5 }} /> Desktop
                    </ToggleButton>
                    <ToggleButton value="mobile">
                      <SmartphoneIcon fontSize="small" sx={{ mr: 0.5 }} /> Mobile
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <TextField
                  fullWidth
                  label="Website URL"
                  placeholder="https://yoursite.com"
                  value={url}
                  onChange={(e) => onUrlChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !loading && onAnalyze()
                  }
                  error={Boolean(error)}
                  helperText={error || undefined}
                  disabled={loading}
                  slotProps={{
                    htmlInput: { "aria-label": "Website URL" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: isDark
                        ? alpha("#000", 0.25)
                        : alpha("#fff", 0.85),
                      transition:
                        "box-shadow 0.25s ease, border-color 0.2s ease",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.primary.main, 0.45),
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 3px ${alpha(
                          theme.palette.primary.main,
                          0.22
                        )}`,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 1,
                      },
                    },
                  }}
                />

                <Box
                  component={motion.div}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  sx={{ alignSelf: "flex-start" }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onAnalyze}
                    disabled={loading}
                    sx={{
                      px: 3.5,
                      py: 1.35,
                      fontSize: "1rem",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      borderRadius: 2,
                      boxShadow: (t) =>
                        `0 0 32px ${alpha(
                          t.palette.primary.main,
                          0.45
                        )}, 0 12px 28px -8px ${alpha(
                          t.palette.primary.main,
                          0.35
                        )}`,
                      "&:hover": {
                        boxShadow: (t) =>
                          `0 0 44px ${alpha(
                            t.palette.primary.main,
                            0.55
                          )}, 0 16px 36px -8px ${alpha(
                            t.palette.primary.main,
                            0.4
                          )}`,
                      },
                    }}
                  >
                    Analyze
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        </Box>
      </Stack>
    </motion.div>
  );
}

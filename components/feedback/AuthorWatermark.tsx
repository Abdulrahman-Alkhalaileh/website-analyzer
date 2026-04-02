"use client";

import EmailOutlined from "@mui/icons-material/EmailOutlined";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import { Box, Link, Stack, Typography } from "@mui/material";
import {
  getAuthorDisplayName,
  getAuthorEmail,
  getAuthorGithubUrl,
  getAuthorLinkedInUrl,
  authorWatermarkEnabled,
} from "@/helpers/author";

export function AuthorWatermark() {
  if (!authorWatermarkEnabled()) return null;

  const name = getAuthorDisplayName();
  const github = getAuthorGithubUrl();
  const linkedIn = getAuthorLinkedInUrl();
  const email = getAuthorEmail();

  return (
    <Box
      component="footer"
      aria-label="Site credits"
      sx={{
        pt: 3,
        pb: 1,
        mt: 1,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Stack alignItems="center" justifyContent="center" mb={2}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "text.secondary",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontWeight: 600,
            fontSize: "0.65rem",
            opacity: 0.85,
          }}
        >
          Built by
        </Typography>
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{
            color: "text.primary",
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        gap={{ xs: 1, sm: 2 }}
        sx={{ rowGap: 1 }}
      >
        {email ? (
          <Link
            href={`mailto:${encodeURIComponent(email)}`}
            underline="hover"
            variant="body2"
            fontWeight={600}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <EmailOutlined sx={{ fontSize: 18, opacity: 0.9 }} aria-hidden />
            {email.split("@")[0]}
          </Link>
        ) : null}
        {github ? (
          <Link
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            variant="body2"
            fontWeight={600}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <GitHub sx={{ fontSize: 18, opacity: 0.9 }} aria-hidden />
            GitHub
          </Link>
        ) : null}
        {linkedIn ? (
          <Link
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            variant="body2"
            fontWeight={600}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <LinkedIn sx={{ fontSize: 18, opacity: 0.9 }} aria-hidden />
            LinkedIn
          </Link>
        ) : null}
      </Stack>
    </Box>
  );
}

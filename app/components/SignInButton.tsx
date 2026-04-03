"use client";

import LoginRounded from "@mui/icons-material/LoginRounded";
import { Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";
import type { FC } from "react";

export type SignInButtonProps = object;

const SignInButton: FC<SignInButtonProps> = () => (
  <Button
    component={Link}
    href="/auth/login"
    variant="outlined"
    color="primary"
    size="small"
    startIcon={<LoginRounded sx={{ fontSize: 18 }} />}
    sx={{
      fontWeight: 700,
      borderRadius: 999,
      px: 2,
      borderWidth: 2,
      "&:hover": { borderWidth: 2 },
      bgcolor: (t) => alpha(t.palette.background.paper, 0.5),
      backdropFilter: "blur(8px)",
    }}
  >
    Sign in
  </Button>
);

export default SignInButton;

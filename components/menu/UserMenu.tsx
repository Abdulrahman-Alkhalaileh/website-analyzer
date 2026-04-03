"use client";

import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import SignInButton from "@/app/components/SignInButton";
import { supabase } from "@/lib/supabase";

const UserMenu: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!cancelled) setUser(u ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleClose = () => setAnchorEl(null);

  const handleSignOut = async () => {
    handleClose();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (user === undefined) {
    return (
      <Box
        aria-busy
        aria-label="Loading account"
        sx={{
          height: 36,
          width: 102,
          borderRadius: 999,
          border: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: (t) => alpha(t.palette.background.paper, 0.5),
          backdropFilter: "blur(8px)",
        }}
      >
        <CircularProgress size={18} thickness={4} />
      </Box>
    );
  }

  if (!user) {
    return <SignInButton />;
  }

  const email = user.email ?? "Signed in";
  const needsEmailConfirm = user.email != null && user.email_confirmed_at == null;

  return (
    <>
      <Tooltip title="Account menu">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Open account menu"
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          sx={{
            p: 0.25,
            borderRadius: 999,
            border: 1,
            borderColor: "divider",
            bgcolor: (t) => alpha(t.palette.background.paper, 0.72),
            backdropFilter: "blur(12px)",
            boxShadow: (t) =>
              `0 0 0 1px ${alpha(
                t.palette.common.white,
                t.palette.mode === "dark" ? 0.06 : 0
              )}`,
            "&:hover": {
              bgcolor: (t) => alpha(t.palette.background.paper, 0.88),
            },
          }}
        >
          <Avatar
            src={user.user_metadata?.avatar_url as string | undefined}
            alt=""
            sx={{
              width: 36,
              height: 36,
              fontSize: "0.95rem",
              fontWeight: 800,
              bgcolor: "primary.main",
            }}
          >
            {email.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 280,
              maxWidth: "min(100vw - 24px, 320px)",
              borderRadius: 2.5,
              border: 1,
              borderColor: "divider",
              bgcolor: (t) =>
                alpha(
                  t.palette.background.paper,
                  isDark ? 0.94 : 0.98
                ),
              backdropFilter: "blur(16px)",
              boxShadow: isDark
                ? `0 0 0 1px ${alpha("#fff", 0.05)}, 0 20px 48px -12px rgba(0,0,0,0.55)`
                : `0 0 0 1px ${alpha("#0f172a", 0.06)}, 0 16px 40px -12px ${alpha("#0f172a", 0.12)}`,
              overflow: "hidden",
            },
          },
        }}
        MenuListProps={{ dense: true, sx: { py: 0 } }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.75,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: (t) => alpha(t.palette.primary.main, isDark ? 0.08 : 0.04),
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
            <Avatar
              src={user.user_metadata?.avatar_url as string | undefined}
              alt=""
              sx={{
                width: 44,
                height: 44,
                fontSize: "1.1rem",
                fontWeight: 800,
                bgcolor: "primary.main",
                flexShrink: 0,
              }}
            >
              {email.charAt(0).toUpperCase()}
            </Avatar>
            <Stack gap={0.5} sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight={800} noWrap title={email}>
                {email}
              </Typography>
              {needsEmailConfirm ? (
                <Chip
                  size="small"
                  label="Email not verified"
                  color="warning"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start", fontWeight: 700, height: 22 }}
                />
              ) : (
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Signed in
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>

        <MenuItem
          component={Link}
          href="/"
          onClick={handleClose}
          sx={{ py: 1.25, borderRadius: 0 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <AssessmentOutlined fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Run an audit"
            secondary="PageSpeed & Lighthouse"
            primaryTypographyProps={{ variant: "body2", fontWeight: 700 }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </MenuItem>

        <MenuItem
          component={Link}
          href="/dashboard"
          onClick={handleClose}
          sx={{ py: 1.25, borderRadius: 0 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DashboardOutlined fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            secondary="Saved audits & charts"
            primaryTypographyProps={{ variant: "body2", fontWeight: 700 }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => void handleSignOut()}
          sx={{
            py: 1.25,
            borderRadius: 0,
            color: "error.main",
            "&:hover": {
              bgcolor: (t) => alpha(t.palette.error.main, isDark ? 0.12 : 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutRounded fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            primaryTypographyProps={{ variant: "body2", fontWeight: 700 }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;

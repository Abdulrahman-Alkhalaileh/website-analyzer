"use client";

import { Box, Button, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import UserMenu from "@/components/menu/UserMenu";
import { ThemeModeToggle } from "@/components/feedback/ThemeModeToggle";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { usePathname } from "next/navigation";
import { BrandMark } from "../brand/BrandMark";

/** Right-aligned controls: account menu + theme toggle (same as the audit home page). */
export function AppTopBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 22,
        delay: 0.02,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {isHome ? (
          <Link href="/dashboard">
            <Button
              variant="text"
              color="primary"
              startIcon={<DashboardIcon />}
              sx={{ fontWeight: 600, fontSize: 16 }}
            >
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <BrandMark title="Home page" />
          </Link>
        )}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
        >
          <UserMenu />
          <Box
            sx={{
              borderRadius: 999,
              border: 1,
              borderColor: "divider",
              bgcolor: (t) => alpha(t.palette.background.paper, 0.72),
              backdropFilter: "blur(12px)",
              px: 0.25,
              boxShadow: (t) =>
                `0 0 0 1px ${alpha(
                  t.palette.common.white,
                  t.palette.mode === "dark" ? 0.06 : 0
                )}`,
            }}
          >
            <ThemeModeToggle />
          </Box>
        </Stack>
      </Stack>
    </motion.div>
  );
}

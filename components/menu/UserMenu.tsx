"use client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SignInButton from "@/app/components/SignInButton";
import LogoutIcon from "@mui/icons-material/Logout";

export type UserMenuProps = object;

const UserMenu: React.FC<UserMenuProps> = ({}) => {
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  if (!user) {
    return <SignInButton />;
  }
  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar
          src={user.user_metadata.avatar_url}
          alt={user.email}
          sx={{ bgcolor: "primary.main", fontSize: 24, fontWeight: 700 }}
        >
          {user.email?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Stack gap={1} p={1}>
          <Typography
            variant="body1"
            fontWeight={600}
            fontSize={14}
            px={2}
            py={1}
          >
            {user.email}
          </Typography>
          <Button
            fullWidth
            color="error"
            startIcon={<LogoutIcon />}
            size="small"
            onClick={() => {
              supabase.auth.signOut();
              setAnchorEl(null);
              router.push("/");
              router.refresh();
              setUser(null);
            }}
          >
            Logout
          </Button>
        </Stack>
      </Menu>
    </>
  );
};

export default UserMenu;

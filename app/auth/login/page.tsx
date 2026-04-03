"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthPageLayout } from "@/app/auth/components/AuthPageLayout";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setSeverity("error");
      setMessage(error.message);
      return;
    }
    setSeverity("success");
    setMessage("Signed in. Redirecting…");
    router.push("/");
    router.refresh();
  };

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in with the email and password for your account."
      alternate={{ href: "/auth/signup", label: "Need an account? Create one" }}
    >
      <Box component="form" onSubmit={handleLogin} noValidate>
        <Stack gap={2.25}>
          {message ? (
            <Alert severity={severity} variant="outlined">
              {message}
            </Alert>
          ) : null}

          <TextField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            disabled={loading}
            autoFocus
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            disabled={loading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" aria-hidden /> : undefined
            }
            sx={{ mt: 0.5, fontWeight: 700 }}
          >
            Sign in
          </Button>
        </Stack>
      </Box>
    </AuthPageLayout>
  );
}

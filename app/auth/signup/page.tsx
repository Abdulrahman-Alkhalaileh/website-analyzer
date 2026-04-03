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
import { useState, type FormEvent } from "react";
import { AuthPageLayout } from "@/app/auth/components/AuthPageLayout";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
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
    setMessage(
      "Account created. If email confirmation is enabled, check your inbox to verify before signing in."
    );
    router.push("/auth/login");
  };

  return (
    <AuthPageLayout
      title="Create an account"
      subtitle="Use a strong password. You can run audits after you sign in."
      alternate={{
        href: "/auth/login",
        label: "Already have an account? Sign in",
      }}
    >
      <Box component="form" onSubmit={handleSignUp} noValidate>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            disabled={loading}
            helperText="At least 6 characters (or your project’s Supabase policy)."
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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
              loading ? (
                <CircularProgress size={20} color="inherit" aria-hidden />
              ) : undefined
            }
            sx={{ mt: 0.5, fontWeight: 700 }}
          >
            Create account
          </Button>
        </Stack>
      </Box>
    </AuthPageLayout>
  );
}

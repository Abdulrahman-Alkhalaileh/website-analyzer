"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

export type SignInButtonProps = object;

const SignInButton: React.FC<SignInButtonProps> = ({}) => {
  return (
    <Link href="/auth/login">
      <Button variant="outlined" color="primary" size="small">
        Sign in
      </Button>
    </Link>
  );
};

export default SignInButton;

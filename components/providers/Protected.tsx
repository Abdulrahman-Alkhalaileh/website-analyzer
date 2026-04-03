"use client";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export type ProtectedProps = {
  children: React.ReactNode;
};

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        redirect("/auth/login");
      } else {
        setIsProtected(true);
      }
    });
  }, []);

  if (!isProtected) return null;

  return <>{children}</>;
};

export default Protected;

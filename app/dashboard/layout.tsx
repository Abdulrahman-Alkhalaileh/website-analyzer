import { AppPageChrome } from "@/components/layout/AppPageChrome";
import Protected from "@/components/providers/Protected";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Protected>
      <AppPageChrome>{children}</AppPageChrome>
    </Protected>
  );
}
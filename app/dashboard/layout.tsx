import { AppPageChrome } from "@/components/layout/AppPageChrome";
import Protected from "@/components/providers/Protected";
import {
  DASHBOARD_PAGE_DESCRIPTION,
  SITE_NAME,
} from "@/helpers/site";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const canonical = "/dashboard";

export const metadata: Metadata = {
  title: "Saved audits",
  description: DASHBOARD_PAGE_DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `Saved audits | ${SITE_NAME}`,
    description: DASHBOARD_PAGE_DESCRIPTION,
    url: canonical,
  },
  twitter: {
    card: "summary_large_image",
    title: `Saved audits | ${SITE_NAME}`,
    description: DASHBOARD_PAGE_DESCRIPTION,
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Protected>
      <AppPageChrome>{children}</AppPageChrome>
    </Protected>
  );
}

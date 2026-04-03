import type { Metadata } from "next";
import {
  AUTH_LOGIN_DESCRIPTION,
  AUTH_LOGIN_KEYWORDS,
  SITE_NAME,
} from "@/helpers/site";

const canonical = "/auth/login";

export const metadata: Metadata = {
  title: "Sign in — save audits to your dashboard",
  description: AUTH_LOGIN_DESCRIPTION,
  keywords: AUTH_LOGIN_KEYWORDS,
  robots: { index: true, follow: true },
  alternates: { canonical },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `Sign in | ${SITE_NAME}`,
    description: AUTH_LOGIN_DESCRIPTION,
    url: canonical,
  },
  twitter: {
    card: "summary_large_image",
    title: `Sign in | ${SITE_NAME}`,
    description: AUTH_LOGIN_DESCRIPTION,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

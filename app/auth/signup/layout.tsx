import type { Metadata } from "next";
import {
  AUTH_SIGNUP_DESCRIPTION,
  AUTH_SIGNUP_KEYWORDS,
  SITE_NAME,
} from "@/helpers/site";

const canonical = "/auth/signup";

export const metadata: Metadata = {
  title: "Create a free account — save your audits",
  description: AUTH_SIGNUP_DESCRIPTION,
  keywords: AUTH_SIGNUP_KEYWORDS,
  robots: { index: true, follow: true },
  alternates: { canonical },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `Create account | ${SITE_NAME}`,
    description: AUTH_SIGNUP_DESCRIPTION,
    url: canonical,
  },
  twitter: {
    card: "summary_large_image",
    title: `Create account | ${SITE_NAME}`,
    description: AUTH_SIGNUP_DESCRIPTION,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

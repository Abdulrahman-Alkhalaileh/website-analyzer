import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { JsonLd } from "@/components/seo/JsonLd";
import { Providers } from "@/components/providers/Providers";
import { buildPrimaryJsonLd } from "@/helpers/seo-graph";
import { BRAND_SHORT_NAME } from "@/helpers/brand";
import { getAuthorDisplayName, getAuthorGithubUrl } from "@/helpers/author";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/helpers/site";

const siteUrl = getSiteUrl();
const creatorName = getAuthorDisplayName();
const creatorGithub = getAuthorGithubUrl();
const metadataAuthors = creatorName
  ? [{ name: creatorName, ...(creatorGithub ? { url: creatorGithub } : {}) }]
  : [{ name: SITE_NAME }];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — PageSpeed & Lighthouse audit`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "PageSpeed Insights",
    "Lighthouse",
    "website speed test",
    "Core Web Vitals",
    "SEO audit",
    "performance audit",
    "Google PageSpeed",
    "web performance",
  ],
  applicationName: BRAND_SHORT_NAME,
  authors: metadataAuthors,
  creator: creatorName || SITE_NAME,
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <JsonLd data={buildPrimaryJsonLd()} />
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

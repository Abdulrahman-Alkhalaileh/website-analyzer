import { HomeSeoFaq } from "@/app/components/HomeSeoFaq";
import { HomeSeoIntro } from "@/app/components/HomeSeoIntro";
import { WebsiteAuditClient } from "@/app/components/website-audit/WebsiteAuditClient";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <noscript>
        <p
          className="p-4 text-center text-sm"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          This tool needs JavaScript to run PageSpeed Insights. Please enable
          JavaScript in your browser.
        </p>
      </noscript>
      <Suspense
        fallback={
          <div
            className="min-h-screen"
            style={{ backgroundColor: "#0B0B0B" }}
            aria-hidden
          />
        }
      >
        <WebsiteAuditClient
          seoIntro={<HomeSeoIntro />}
          seoFaq={<HomeSeoFaq />}
        />
      </Suspense>
    </main>
  );
}

import { WebsiteAuditClient } from "@/app/components/website-audit/WebsiteAuditClient";

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
      <WebsiteAuditClient />
    </main>
  );
}

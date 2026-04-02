"use client";

import { Button, Container, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { AnalysisLoadingOverlay } from "@/components/feedback/AnalysisLoadingOverlay";
import { ScoreCardsRow } from "@/components/cards/ScoreCardsRow";
import { WebsitePreviewCard } from "@/components/cards/WebsitePreviewCard";
import { DashboardSection } from "@/components/sections/DashboardSection";
import { EntitiesSection } from "@/components/sections/EntitiesSection";
import { FieldDataSection } from "@/components/sections/FieldDataSection";
import { IssuesSection } from "@/components/sections/IssuesSection";
import { NetworkHighlightsSection } from "@/components/sections/NetworkHighlightsSection";
import { OpportunitiesSection } from "@/components/sections/OpportunitiesSection";
import { PerformanceMetricsSection } from "@/components/sections/PerformanceMetricsSection";
import { ResourceBreakdownSection } from "@/components/sections/ResourceBreakdownSection";
import { RunMetadataSection } from "@/components/sections/RunMetadataSection";
import { RunWarningsSection } from "@/components/sections/RunWarningsSection";
import { ThirdPartySection } from "@/components/sections/ThirdPartySection";
import { LandingHero } from "./LandingHero";
import {
  buildAuditDashboard,
  validateHttpUrl,
  type LabStrategy,
} from "@/helpers/audit";
import { LINKS } from "@/helpers/doc-links";
import type { PageSpeedApiResponse } from "@/helpers/types/pagespeed";

export function WebsiteAuditClient() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<LabStrategy>("mobile");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageSpeedApiResponse | null>(null);

  const dashboard = buildAuditDashboard(data);

  const handleAnalyze = async () => {
    setError(null);
    const v = validateHttpUrl(url);
    if (!v.ok) {
      setError(v.message);
      return;
    }
    const normalized = url.trim().includes("://")
      ? url.trim()
      : `https://${url.trim()}`;

    setLoading(true);
    setData(null);
    try {
      const res = await axios.get<PageSpeedApiResponse>(
        `/api/analyze?url=${encodeURIComponent(normalized)}&strategy=${strategy}`
      );
      setData(res.data);
    } catch (e) {
      console.error(e);
      setError("We couldn’t reach PageSpeed Insights. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const hasFieldData =
    Boolean(dashboard?.fieldOverallUrl) ||
    Boolean(dashboard?.fieldOverallOrigin) ||
    (dashboard?.fieldDataUrl.length ?? 0) > 0 ||
    (dashboard?.fieldDataOrigin.length ?? 0) > 0;

  const hasScreenshots =
    Boolean(dashboard?.screenshotData) ||
    (dashboard?.filmstripFrames.length ?? 0) > 0 ||
    Boolean(dashboard?.finalScreenshotSrc);

  return (
    <>
      <AnalysisLoadingOverlay
        key={loading ? "analyzing" : "idle"}
        open={loading}
        targetUrl={url.trim()}
      />

      <Stack
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Stack gap={6}>
            <LandingHero
              url={url}
              onUrlChange={setUrl}
              strategy={strategy}
              onStrategyChange={setStrategy}
              onAnalyze={handleAnalyze}
              loading={loading}
              error={error}
            />

            {dashboard && !loading ? (
              <Stack
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                gap={2}
              >
                <Divider flexItem sx={{ borderColor: "divider" }} />

                <Stack gap={0.5}>
                  <Typography variant="h5" fontWeight={700}>
                    Results dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Each block below folds open or closed. Colors on the left edge
                    mean: green = healthy context, blue = informational, orange =
                    review soon, red = likely problems. Use the ? tooltips for a
                    one-line explanation.
                  </Typography>
                  {dashboard.finalUrl ? (
                    <Typography variant="body2" color="text.secondary">
                      Analyzed: {dashboard.finalUrl}
                    </Typography>
                  ) : null}
                </Stack>

                <DashboardSection
                  id="scores"
                  title="Category scores"
                  subtitle="Weighted Lighthouse scores (not the same as raw timing numbers)."
                  defaultExpanded
                  helpText="Four pillars: Performance, SEO, Accessibility, Best practices. Each is 0–100 from Lighthouse for this single run."
                  learnMoreHref={LINKS.lighthouseScoring}
                  learnMoreLabel="How scoring works"
                >
                  <ScoreCardsRow scores={dashboard.categoryScores} />
                </DashboardSection>

                <DashboardSection
                  id="run"
                  title="Run details"
                  subtitle="When the trace ran and how PageSpeed emulated the device."
                  defaultExpanded={false}
                  helpText="Metadata only. Use it to confirm you compared mobile-to-mobile or desktop-to-desktop runs."
                  learnMoreHref={LINKS.pageSpeedDocs}
                  learnMoreLabel="PageSpeed API"
                >
                  <RunMetadataSection
                    embedded
                    runInfo={dashboard.runInfo}
                    finalUrl={dashboard.finalUrl}
                  />
                </DashboardSection>

                {dashboard.runWarnings.length > 0 ? (
                  <DashboardSection
                    id="warnings"
                    title="Lighthouse warnings"
                    subtitle="Issues with the audit itself or the page under test."
                    defaultExpanded
                    helpText="Orange alerts are usual caveats. Red means Lighthouse suggests something went wrong (timeouts, invalid state, etc.)."
                    learnMoreHref={LINKS.lighthouseOverview}
                  >
                    <RunWarningsSection embedded warnings={dashboard.runWarnings} />
                  </DashboardSection>
                ) : null}

                {hasFieldData ? (
                  <DashboardSection
                    id="field"
                    title="Real users (Chrome UX Report)"
                    subtitle="Field data from Chrome over ~28 days—can differ from lab scores."
                    defaultExpanded
                    helpText="FAST / AVERAGE / SLOW buckets describe real-user experience for users who generated enough traffic for Google to publish stats."
                    learnMoreHref={LINKS.chromeUxReport}
                    learnMoreLabel="About CrUX"
                  >
                    <FieldDataSection
                      embedded
                      urlRows={dashboard.fieldDataUrl}
                      originRows={dashboard.fieldDataOrigin}
                      overallUrl={dashboard.fieldOverallUrl}
                      overallOrigin={dashboard.fieldOverallOrigin}
                    />
                  </DashboardSection>
                ) : null}

                {hasScreenshots ? (
                  <DashboardSection
                    id="screens"
                    title="Screenshots & load timeline"
                    subtitle="Filmstrip frames plus optional full-page capture."
                    defaultExpanded
                    helpText="Small frames = page while loading. Tall image = stitched full scroll height (expected to look long)."
                    learnMoreHref={LINKS.lighthouseOverview}
                    learnMoreLabel="Lighthouse reports"
                  >
                    <WebsitePreviewCard
                      embedded
                      labStrategy={dashboard.runInfo.labStrategy}
                      filmstripFrames={dashboard.filmstripFrames}
                      fullPageSrc={dashboard.screenshotData}
                      finalScreenshotSrc={dashboard.finalScreenshotSrc}
                      siteLabel={dashboard.finalUrl}
                    />
                  </DashboardSection>
                ) : null}

                {dashboard.coreWebVitals.length > 0 ||
                dashboard.labMetrics.length > 0 ? (
                  <DashboardSection
                    id="lab-metrics"
                    title="Lab performance metrics"
                    subtitle="Synthetic timings and scored vitals from this Lighthouse trace."
                    defaultExpanded
                    helpText="Lab uses a controlled environment. A green bar means Lighthouse scored that metric well—not that every user is fast."
                    learnMoreHref={LINKS.webVitals}
                    learnMoreLabel="Web Vitals"
                  >
                    <PerformanceMetricsSection
                      embedded
                      coreWebVitals={dashboard.coreWebVitals}
                      labMetrics={dashboard.labMetrics}
                    />
                  </DashboardSection>
                ) : null}

                {dashboard.networkHighlights.length > 0 ? (
                  <DashboardSection
                    id="network"
                    title="Network & weight highlights"
                    subtitle="Quick server, redirect, and payload signals."
                    defaultExpanded={false}
                    helpText="Warm border rows are common bottlenecks (slow first byte or heavy total download). They are hints, not automatic failures."
                  >
                    <NetworkHighlightsSection
                      embedded
                      highlights={dashboard.networkHighlights}
                    />
                  </DashboardSection>
                ) : null}

                {dashboard.resourceByType.length > 0 ? (
                  <DashboardSection
                    id="resources"
                    title="Resources by type"
                    subtitle="Request counts and transfer size by resource kind."
                    defaultExpanded={false}
                    helpText="Comes from Lighthouse’s resource summary. Large rows are highlighted to spot heavy scripts or images."
                  >
                    <ResourceBreakdownSection embedded rows={dashboard.resourceByType} />
                  </DashboardSection>
                ) : null}

                {dashboard.opportunities.length > 0 ? (
                  <DashboardSection
                    id="opportunities"
                    title="Optimization opportunities"
                    subtitle="Estimated savings Lighthouse attributed to specific audits."
                    defaultExpanded
                    helpText="Higher estimated time or byte savings are prioritized with stronger colors. Estimates vary by page and are not guarantees."
                    learnMoreHref={LINKS.lighthouseScoring}
                  >
                    <OpportunitiesSection embedded opportunities={dashboard.opportunities} />
                  </DashboardSection>
                ) : null}

                {dashboard.thirdParties.length > 0 ? (
                  <DashboardSection
                    id="third-parties"
                    title="Third-party impact"
                    subtitle="Entities and their main-thread / transfer cost."
                    defaultExpanded={false}
                    helpText="Tags, ads, and analytics often show up here. High main-thread time hurts interactivity even if downloads look small."
                  >
                    <ThirdPartySection embedded rows={dashboard.thirdParties} />
                  </DashboardSection>
                ) : null}

                {dashboard.entities.length > 0 ? (
                  <DashboardSection
                    id="entities"
                    title="First vs third party"
                    subtitle="How Lighthouse grouped origins on this URL."
                    defaultExpanded={false}
                    helpText="Helps separate your own assets from vendors when reading audits and opportunities."
                  >
                    <EntitiesSection embedded entities={dashboard.entities} />
                  </DashboardSection>
                ) : null}

                <DashboardSection
                  id="issues"
                  title="Issues & plain-language fixes"
                  subtitle="Failed or weak audits explained in everyday language."
                  defaultExpanded
                  helpText="Red items are the harshest Lighthouse scores in this run. Use the Chrome docs links inside for vetted guidance—we avoid guessed article URLs."
                  learnMoreHref={LINKS.lighthouseOverview}
                  learnMoreLabel="Lighthouse overview"
                >
                  <IssuesSection embedded issues={dashboard.issues} />
                </DashboardSection>

                <Stack direction="row" justifyContent="center" sx={{ pt: 2 }}>
                  <Button variant="outlined" onClick={() => setData(null)}>
                    Run another URL
                  </Button>
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        </Container>
      </Stack>
    </>
  );
}

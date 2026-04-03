"use client";

import { Button, Stack } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import type { FC } from "react";
import { ResultsHero } from "@/components/feedback/ResultsHero";
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
import type { AuditDashboard } from "@/helpers/audit";
import { LINKS } from "@/helpers/doc-links";
import { AuditGradientRule } from "./AuditGradientRule";

export type AuditDashboardViewProps = {
  dashboard: AuditDashboard;
  /** Home flow: confirm or clear for new audit (may be async when checking auth). */
  onRequestNewAudit?: () => void | Promise<void>;
};

export const AuditDashboardView: FC<AuditDashboardViewProps> = ({
  dashboard,
  onRequestNewAudit,
}) => {
  const reduceMotion = useReducedMotion();

  const hasFieldData =
    Boolean(dashboard.fieldOverallUrl) ||
    Boolean(dashboard.fieldOverallOrigin) ||
    dashboard.fieldDataUrl.length > 0 ||
    dashboard.fieldDataOrigin.length > 0;

  const hasScreenshots =
    Boolean(dashboard.screenshotData) ||
    dashboard.filmstripFrames.length > 0 ||
    Boolean(dashboard.finalScreenshotSrc);

  return (
    <Stack gap={2.5} sx={{ width: "100%" }}>
      <ResultsHero
        finalUrl={dashboard.finalUrl}
        performanceScore={dashboard.categoryScores.performance}
        labStrategy={dashboard.runInfo.labStrategy}
        onNewAudit={onRequestNewAudit}
      />
      <AuditGradientRule variant="results" />
      <motion.div
        style={{ width: "100%" }}
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 20,
          delay: 0.08,
        }}
      >
        <Stack gap={2}>
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
            id="seo-checks"
            title="SEO checks"
            subtitle="Lighthouse SEO audits for this page (titles, meta description, crawlability, hreflang, structured data, and more)."
            defaultExpanded
            helpText="PageSpeed returns the full Lighthouse report, including every SEO audit. The SEO score card summarizes the category; this list shows only audits in the SEO group that failed for this run. The general “Issues” section below shows the ten worst failing audits across all categories, so SEO items are often crowded out there."
            learnMoreHref={LINKS.lighthouseSeo}
            learnMoreLabel="Lighthouse SEO"
          >
            <IssuesSection
              embedded
              issues={dashboard.seoIssues}
              noIssuesMessage="No failed SEO checks in this run. The SEO score still reflects Lighthouse’s full SEO category for this URL."
              listIntro="These audits are scoped to Lighthouse’s SEO category only. They describe technical and on-page signals from this lab run, not live Google Search rankings."
              extraDocLinks={[
                {
                  href: LINKS.lighthouseSeo,
                  label: "Lighthouse SEO category ↗",
                },
              ]}
            />
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

          {dashboard.coreWebVitals.length > 0 || dashboard.labMetrics.length > 0 ? (
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
              <NetworkHighlightsSection embedded highlights={dashboard.networkHighlights} />
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

          {onRequestNewAudit ? (
            <Stack direction="row" justifyContent="center" sx={{ pt: 2 }}>
              <Button
                variant="text"
                size="large"
                onClick={onRequestNewAudit}
                sx={{ fontWeight: 600 }}
              >
                Audit another URL
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </motion.div>
    </Stack>
  );
};

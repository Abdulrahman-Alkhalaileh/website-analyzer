"use client";

import axios from "axios";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnalysisLoadingOverlay } from "@/app/components/website-audit/AnalysisLoadingOverlay";
import { AppPageChrome } from "@/components/layout/AppPageChrome";
import { AuditDashboardView } from "@/app/components/website-audit/AuditDashboardView";
import { AuditLandingColumn } from "@/app/components/website-audit/AuditLandingColumn";
import { NewAuditConfirmDialog } from "@/app/components/website-audit/NewAuditConfirmDialog";
import { SavedToDashboardNotice } from "@/components/feedback/SavedToDashboardNotice";
import { Alert, CircularProgress, Stack } from "@mui/material";
import {
  averageCategoryScoresAsPercent,
  buildAuditDashboard,
  parseSavedAuditDashboardJson,
  type AuditDashboard,
  validateHttpUrl,
  type LabStrategy,
} from "@/helpers/audit";
import type { PageSpeedApiResponse } from "@/helpers/types/pagespeed";
import { supabase } from "@/lib/supabase";

export function WebsiteAuditClient({
  seoIntro,
  seoFaq,
}: {
  seoIntro: ReactNode;
  seoFaq: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("report");

  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<LabStrategy>("desktop");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveApiData, setLiveApiData] = useState<PageSpeedApiResponse | null>(
    null
  );
  const [savedDashboard, setSavedDashboard] = useState<AuditDashboard | null>(
    null
  );
  const [loadingSavedReport, setLoadingSavedReport] = useState(false);
  const [savedReportError, setSavedReportError] = useState<string | null>(null);
  const [confirmNewAuditOpen, setConfirmNewAuditOpen] = useState(false);
  const [saveToDashboardNoticeOpen, setSaveToDashboardNoticeOpen] =
    useState(false);
  const [saveToDashboardNoticeMinimized, setSaveToDashboardNoticeMinimized] =
    useState(false);

  const liveDashboard = useMemo(
    () => buildAuditDashboard(liveApiData),
    [liveApiData]
  );
  const effectiveDashboard = savedDashboard ?? liveDashboard;

  const clearReportFromUrl = useCallback(() => {
    router.replace(pathname || "/");
  }, [router, pathname]);

  const clearAuditAndUrl = useCallback(() => {
    setConfirmNewAuditOpen(false);
    setLiveApiData(null);
    setSavedDashboard(null);
    setSavedReportError(null);
    setSaveToDashboardNoticeOpen(false);
    clearReportFromUrl();
  }, [clearReportFromUrl]);

  /** Signed-in users skip the confirm dialog; guests see it (with sign-in reminder). */
  const handleRequestNewAudit = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      clearAuditAndUrl();
    } else {
      setConfirmNewAuditOpen(true);
    }
  }, [clearAuditAndUrl]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setSaveToDashboardNoticeOpen(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!reportId) {
      setSavedDashboard(null);
      setSavedReportError(null);
      setLoadingSavedReport(false);
      return;
    }

    setSaveToDashboardNoticeOpen(false);
    let cancelled = false;
    setLoadingSavedReport(true);
    setSavedReportError(null);

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) {
          setLoadingSavedReport(false);
          setSavedReportError("Sign in to open saved audits from your dashboard.");
          setSavedDashboard(null);
        }
        return;
      }

      const { data: row, error: qError } = await supabase
        .from("reports")
        .select("data")
        .eq("id", reportId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      setLoadingSavedReport(false);

      if (qError || !row) {
        setSavedReportError(
          "We couldn’t load that report. It may have been removed or you don’t have access."
        );
        setSavedDashboard(null);
        return;
      }

      const raw = row.data;
      const json =
        typeof raw === "string"
          ? raw
          : raw != null && typeof raw === "object"
            ? JSON.stringify(raw)
            : null;

      const parsed = parseSavedAuditDashboardJson(json);
      if (!parsed) {
        setSavedReportError("This saved report is in an old or invalid format.");
        setSavedDashboard(null);
        return;
      }

      setLiveApiData(null);
      setSavedDashboard(parsed);
    })();

    return () => {
      cancelled = true;
    };
  }, [reportId]);

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

    if (reportId) {
      clearReportFromUrl();
    }
    setSavedDashboard(null);
    setSavedReportError(null);
    setSaveToDashboardNoticeOpen(false);

    setLoading(true);
    setLiveApiData(null);
    try {
      const res = await axios.get<PageSpeedApiResponse>(
        `/api/analyze?url=${encodeURIComponent(
          normalized
        )}&strategy=${strategy}`
      );
      setLiveApiData(res.data);
    } catch (e) {
      console.error(e);
      setError("We couldn’t reach PageSpeed Insights. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const saveReport = useCallback(
    async (built: AuditDashboard) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return;

      const score = averageCategoryScoresAsPercent(built.categoryScores) ?? 0;

      const payload = JSON.stringify(built);
      const { error: insertError } = await supabase.from("reports").insert({
        user_id: user.id,
        url: built.finalUrl,
        score,
        data: payload,
        device: strategy,
        image: built.finalScreenshotSrc,
      });
      if (insertError) {
        console.error(insertError);
      } else {
        setSaveToDashboardNoticeOpen(true);
        setSaveToDashboardNoticeMinimized(false);
      }
    },
    [strategy]
  );

  useEffect(() => {
    if (liveDashboard) {
      saveReport(liveDashboard);
    }
  }, [liveDashboard, saveReport]);

  const showLanding =
    !effectiveDashboard && !loading && !loadingSavedReport;

  return (
    <>
      <NewAuditConfirmDialog
        open={confirmNewAuditOpen}
        analyzedUrl={effectiveDashboard?.finalUrl ?? null}
        onClose={() => setConfirmNewAuditOpen(false)}
        onConfirm={clearAuditAndUrl}
      />
      <AnalysisLoadingOverlay
        key={loading ? "analyzing" : "idle"}
        open={loading}
        targetUrl={url.trim()}
      />

      <AppPageChrome showAmbient={!effectiveDashboard}>
        <Stack gap={6}>
          {savedReportError && reportId ? (
            <Alert severity="warning" onClose={() => setSavedReportError(null)}>
              {savedReportError}
            </Alert>
          ) : null}

          {loadingSavedReport ? (
            <Stack alignItems="center" justifyContent="center" py={10}>
              <CircularProgress aria-label="Loading saved report" />
            </Stack>
          ) : null}

          {showLanding ? (
            <AuditLandingColumn
              seoIntro={seoIntro}
              url={url}
              onUrlChange={setUrl}
              strategy={strategy}
              onStrategyChange={setStrategy}
              onAnalyze={handleAnalyze}
              loading={loading}
              error={error}
            />
          ) : null}

          {effectiveDashboard && !loading ? (
            <AuditDashboardView
              dashboard={effectiveDashboard}
              onRequestNewAudit={handleRequestNewAudit}
            />
          ) : null}

          {seoFaq}
        </Stack>
      </AppPageChrome>

      <SavedToDashboardNotice
        open={
          saveToDashboardNoticeOpen &&
          Boolean(liveDashboard) &&
          !savedDashboard
        }
        minimized={saveToDashboardNoticeMinimized}
        onMinimize={() => setSaveToDashboardNoticeMinimized(true)}
        onExpand={() => setSaveToDashboardNoticeMinimized(false)}
        onDismiss={() => setSaveToDashboardNoticeOpen(false)}
      />
    </>
  );
}

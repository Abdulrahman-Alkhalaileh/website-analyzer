"use client";

import { WebsiteReportCard } from "@/components/cards/WebsiteReportCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import {
  type ReportRow,
  groupReportsByDomain,
} from "@/helpers/dashboard-domain";
import { supabase } from "@/lib/supabase";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState, type FC } from "react";

const Page: FC = () => {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const res = await supabase
        .from("reports")
        .select("id, url, score, device, image, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (!res.error && res.data) {
          setReports(
            res.data.map((r) => ({
              ...r,
              image: r.image ?? null,
            })) as ReportRow[]
          );
        } else {
          setReports([]);
        }
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const websiteGroups = useMemo(() => groupReportsByDomain(reports), [reports]);

  return (
    <Stack gap={3}>
      <Stack gap={0.75}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={800}
          letterSpacing="-0.03em"
          sx={{ fontSize: { xs: "1.5rem", sm: "1.85rem" } }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 560 }}
        >
          Welcome back! View your saved website audits and track performance
          over time. You can also run new audits to see how your site is doing.
        </Typography>
      </Stack>

      {loading ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ py: 4, margin: "0 auto" }}
        >
          <CircularProgress size={60} />
        </Stack>
      ) : websiteGroups.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            py: 4,
            px: 2,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: (t) => alpha(t.palette.background.paper, 0.5),
          }}
        >
          No saved reports yet. Run an audit while signed in to see sites here.
        </Typography>
      ) : (
        <Stack gap={4}>
          <DashboardCharts reports={reports} websiteGroups={websiteGroups} />
          <Stack gap={1.5}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="text.secondary"
            >
              Your sites
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 2.5,
              }}
            >
              {websiteGroups.map((g) => (
                <WebsiteReportCard
                  key={g.domainKey}
                  domainKey={g.domainKey}
                  displayLabel={g.displayLabel}
                  reports={g.reports}
                />
              ))}
            </Box>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default Page;

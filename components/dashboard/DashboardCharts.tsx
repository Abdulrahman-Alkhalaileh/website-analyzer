"use client";

import type { ReportRow } from "@/helpers/dashboard-domain";
import {
  auditsByDay,
  deviceMix,
  latestScoresBySite,
  scoreBandCounts,
} from "@/helpers/dashboard-charts";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, type FC } from "react";

type WebsiteGroup = {
  displayLabel: string;
  reports: ReportRow[];
};

export type DashboardChartsProps = {
  reports: ReportRow[];
  websiteGroups: WebsiteGroup[];
};

export const DashboardCharts: FC<DashboardChartsProps> = ({
  reports,
  websiteGroups,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const tickFill = theme.palette.text.secondary;
  const gridStroke = alpha(theme.palette.divider, isDark ? 0.45 : 0.8);
  const tooltipBg = alpha(theme.palette.background.paper, 0.96);
  const tooltipStyle = {
    backgroundColor: tooltipBg,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    fontSize: 12,
    color: theme.palette.text.primary,
  };

  const byDay = useMemo(() => auditsByDay(reports, 14), [reports]);
  const devices = useMemo(() => deviceMix(reports), [reports]);
  const bySite = useMemo(
    () => latestScoresBySite(websiteGroups, 12),
    [websiteGroups]
  );
  const bands = useMemo(() => scoreBandCounts(reports), [reports]);

  const deviceColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
  ];
  const bandColors = [
    theme.palette.score.good,
    theme.palette.score.medium,
    theme.palette.score.poor,
  ];

  const cardSx = {
    borderRadius: 2,
    border: 1,
    borderColor: "divider",
    bgcolor: (t: typeof theme) =>
      alpha(t.palette.background.paper, isDark ? 0.55 : 0.85),
    backgroundImage: isDark
      ? `linear-gradient(155deg, ${alpha("#fff", 0.06)} 0%, ${alpha(
          "#fff",
          0.02
        )} 100%)`
      : undefined,
    height: "100%",
  };

  const chartH = 220;

  return (
    <Stack gap={2.5}>
      <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
        Overview
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
          gap: 2.5,
        }}
      >
        <Card elevation={0} sx={cardSx}>
          <CardContent sx={{ pt: 2, pb: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Audits over time
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Saved runs per day (last 14 days)
            </Typography>
            <Box
              sx={{ width: "100%", height: chartH }}
              role="img"
              aria-label="Bar chart of audits per day"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byDay}
                  margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridStroke}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: tickFill, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: gridStroke }}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={32}
                    tick={{ fill: tickFill, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: gridStroke }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: alpha(theme.palette.primary.main, 0.08) }}
                  />
                  <Bar
                    dataKey="count"
                    name="Audits"
                    radius={[4, 4, 0, 0]}
                    fill={theme.palette.primary.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardSx}>
          <CardContent sx={{ pt: 2, pb: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Device mix
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              All saved audits
            </Typography>
            <Box
              sx={{ width: "100%", height: chartH }}
              role="img"
              aria-label="Pie chart of desktop versus mobile audits"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                  >
                    {devices.map((_, i) => (
                      <Cell
                        key={i}
                        fill={deviceColors[i % deviceColors.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack
              direction="row"
              gap={2}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mt: 0.5 }}
            >
              {devices.map((d, i) => (
                <Stack
                  key={d.name}
                  direction="row"
                  alignItems="center"
                  gap={0.75}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: deviceColors[i % deviceColors.length],
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {d.name}: {d.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        <Card elevation={0} sx={cardSx}>
          <CardContent sx={{ pt: 2, pb: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Latest score by site
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Most recent audit per domain (top {bySite.length})
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: Math.max(200, bySite.length * 36 + 40),
              }}
              role="img"
              aria-label="Horizontal bar chart of latest scores per website"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={bySite}
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridStroke}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: tickFill, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: gridStroke }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fill: tickFill, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: gridStroke }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value ?? ""}`, "Score"]}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { fullName?: string })
                        ?.fullName ?? ""
                    }
                  />
                  <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
                    {bySite.map((row, i) => (
                      <Cell
                        key={i}
                        fill={
                          row.score >= 90
                            ? theme.palette.score.good
                            : row.score >= 50
                            ? theme.palette.score.medium
                            : theme.palette.score.poor
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardSx}>
          <CardContent sx={{ pt: 2, pb: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Score bands
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              How all audits fall into PageSpeed-style ranges
            </Typography>
            <Box
              sx={{ width: "100%", height: chartH }}
              role="img"
              aria-label="Bar chart of score distribution"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bands}
                  margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridStroke}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="range"
                    tick={{ fill: tickFill, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: gridStroke }}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={32}
                    tick={{ fill: tickFill, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: gridStroke }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Audits" radius={[4, 4, 0, 0]}>
                    {bands.map((_, i) => (
                      <Cell key={i} fill={bandColors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
};

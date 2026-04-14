import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

// ─── Icons ───────────────────────────────────────────
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";

import { ResponsesTable } from "@/components/ResponsesTable";
import { colorTokens, extendedPalette } from "@/theme/palette";
import { useI18n } from "@/hooks/useI18n";
import type { FormField, FormSubmissionRecord } from "@/types/form";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
type SortOption = "newest" | "oldest";
type ViewMode = "table" | "list";

interface ResponsesTabProps {
  fields: FormField[];
  rows: FormSubmissionRecord[];
}

// ─────────────────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  trend?: string;
}

function StatCard({ icon, label, value, color, bgColor, trend }: StatCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  return (
    <Card
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 140,
        p: 2,
        borderRadius: 1,
        border: `1px solid ${ext.border.light}`,
        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: `${color}40`,
          boxShadow: `0 4px 16px ${color}10`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1.2,
              mt: 0.5,
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Stack direction="row" alignItems="center" spacing={0.3} sx={{ mt: 0.5 }}>
              <TrendingUpRoundedIcon
                sx={{ fontSize: 12, color: colorTokens.status.success.main }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: colorTokens.status.success.main,
                }}
              >
                {trend}
              </Typography>
            </Stack>
          )}
        </Box>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: bgColor,
            border: `1px solid ${color}20`,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
export function ResponsesTab({ fields, rows }: ResponsesTabProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  // ─── Local State ─────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);

  // ─── Computed Stats ──────────────────────────────────
  const stats = useMemo(() => {
    const total = rows.length;

    // Calculate completion rate
    const requiredFields = fields.filter((f) => f.required);
    const completionRates = rows.map((row) => {
      if (requiredFields.length === 0) return 100;
      const filled = requiredFields.filter((f) => {
        const val = row.data?.[f.id];
        return val !== undefined && val !== null && val !== "";
      }).length;
      return (filled / requiredFields.length) * 100;
    });
    const avgCompletion =
      completionRates.length > 0
        ? Math.round(
          completionRates.reduce((a, b) => a + b, 0) / completionRates.length
        )
        : 0;

    // Today's count
    const today = new Date().toDateString();
    const todayCount = rows.filter(
      (r) => r.submittedAt && new Date(r.submittedAt).toDateString() === today
    ).length;

    // This week count
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekCount = rows.filter(
      (r) => r.submittedAt && new Date(r.submittedAt) >= weekAgo
    ).length;

    // Latest submission
    const latestDate = rows.reduce((latest, r) => {
      if (!r.submittedAt) return latest;
      const d = new Date(r.submittedAt);
      return d > latest ? d : latest;
    }, new Date(0));

    const latestFormatted =
      latestDate.getTime() > 0
        ? formatRelativeTime(latestDate)
        : "Never";

    return { total, avgCompletion, todayCount, weekCount, latestFormatted };
  }, [rows, fields]);

  // ─── Filtered & Sorted Rows ──────────────────────────
  const filteredRows = useMemo(() => {
    let result = [...rows];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row.data ?? {}).some((val) =>
          String(val).toLowerCase().includes(q)
        )
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.submittedAt ?? 0).getTime();
      const dateB = new Date(b.submittedAt ?? 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [rows, searchQuery, sortBy]);

  // ─── Export Handler ──────────────────────────────────
  const handleExportCSV = useCallback(() => {
    if (rows.length === 0) return;

    const headers = fields.map((f) => f.label);
    const csvRows = rows.map((row) =>
      fields.map((f) => {
        const val = row.data?.[f.id];
        return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : String(val ?? "");
      })
    );

    const csv = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `responses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, fields]);

  // ─── Render: Empty State ─────────────────────────────
  if (rows.length === 0) {
    return (
      <Box>
        <ResponsesHeader
          t={t}
          isDark={isDark}
          ext={ext}
          rowCount={0}
        />
        <EmptyState isDark={isDark} ext={ext} t={t} />
      </Box>
    );
  }

  // ─── Render: With Data ───────────────────────────────
  return (
    <Box>
      {/* Header */}
      <ResponsesHeader
        t={t}
        isDark={isDark}
        ext={ext}
        rowCount={rows.length}
      />

      {/* Stats Row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <StatCard
          icon={
            <PersonRoundedIcon
              sx={{ fontSize: 18, color: colorTokens.ocean[isDark ? 400 : 600] }}
            />
          }
          label={t("totalResponses")}
          value={stats.total}
          color={colorTokens.ocean[isDark ? 400 : 600]}
          bgColor={isDark ? colorTokens.ocean[400] + "15" : colorTokens.ocean[600] + "10"}
          trend={stats.todayCount > 0 ? `+${stats.todayCount} today` : undefined}
        />
        <StatCard
          icon={
            <CheckCircleRoundedIcon
              sx={{ fontSize: 18, color: colorTokens.status.success.main }}
            />
          }
          label="Avg Completion"
          value={`${stats.avgCompletion}%`}
          color={colorTokens.status.success.main}
          bgColor={
            isDark
              ? colorTokens.status.success.bgDark
              : colorTokens.status.success.bg
          }
        />
        <StatCard
          icon={
            <CalendarMonthRoundedIcon
              sx={{ fontSize: 18, color: "#8B5CF6" }}
            />
          }
          label="This Week"
          value={stats.weekCount}
          color="#8B5CF6"
          bgColor={isDark ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.08)"}
        />
        <StatCard
          icon={
            <AccessTimeRoundedIcon
              sx={{ fontSize: 18, color: colorTokens.coral[isDark ? 400 : 600] }}
            />
          }
          label="Latest"
          value={stats.latestFormatted}
          color={colorTokens.coral[isDark ? 400 : 600]}
          bgColor={isDark ? colorTokens.coral[400] + "12" : colorTokens.coral[600] + "08"}
        />
      </Stack>

      {/* Search Results Info */}
      {searchQuery && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""} for
          </Typography>
          <Chip
            label={searchQuery}
            size="small"
            onDelete={() => setSearchQuery("")}
            sx={{
              height: 22,
              fontSize: "0.7rem",
              fontWeight: 600,
              bgcolor: ext.accent.primarySoft,
              color: isDark
                ? colorTokens.ocean[300]
                : colorTokens.ocean[700],
            }}
          />
        </Box>
      )}

      {/* Table Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${ext.border.light}`,
          boxShadow: isDark
            ? "0 2px 16px rgba(0,0,0,0.25)"
            : "0 2px 16px rgba(76,110,245,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Table Header Bar */}
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderBottom: `1px solid ${ext.border.light}`,
            bgcolor: isDark
              ? "rgba(255,255,255,0.02)"
              : colorTokens.slate[50],
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <TableChartRoundedIcon
              sx={{
                fontSize: 16,
                color: isDark
                  ? colorTokens.ocean[400]
                  : colorTokens.ocean[600],
              }}
            />
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              {filteredRows.length} ENTRIES
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.65rem" }}
          >
            Sorted by {sortBy === "newest" ? "newest first" : "oldest first"}
          </Typography>
        </Box>

        {/* No results after filter */}
        {filteredRows.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <SearchRoundedIcon
              sx={{ fontSize: 40, color: "text.disabled", mb: 1.5 }}
            />
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              No matching responses
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <ResponsesTable fields={fields} rows={filteredRows} />
        )}
      </Card>

      {/* Footer */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.68rem" }}
        >
          Last updated: {stats.latestFormatted}
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.68rem" }}
        >
          {fields.length} fields · {rows.length} total responses
        </Typography>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────
// HEADER SUB-COMPONENT
// ─────────────────────────────────────────────────────────
function ResponsesHeader({
  t,
  isDark,
  ext,
  rowCount,
}: {
  t: ReturnType<typeof useI18n>["t"];
  isDark: boolean;
  ext: typeof extendedPalette.light | typeof extendedPalette.dark;
  rowCount: number;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={1.5}
      mb={2.5}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            background: colorTokens.gradients.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 2px 8px ${colorTokens.ocean[500]}30`,
          }}
        >
          <BarChartRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
        </Box>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                fontSize: "1.1rem",
                letterSpacing: "-0.02em",
                background: isDark
                  ? `linear-gradient(135deg, ${colorTokens.ocean[300]}, ${colorTokens.teal[300]})`
                  : colorTokens.gradients.accent,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("responses")}
            </Typography>
            <Chip
              label={rowCount}
              size="small"
              sx={{
                height: 20,
                minWidth: 20,
                fontSize: "0.68rem",
                fontWeight: 800,
                bgcolor:
                  rowCount > 0
                    ? isDark
                      ? colorTokens.status.success.bgDark
                      : colorTokens.status.success.bg
                    : ext.accent.primarySoft,
                color:
                  rowCount > 0
                    ? isDark
                      ? colorTokens.status.success.light
                      : colorTokens.status.success.dark
                    : isDark
                      ? colorTokens.ocean[300]
                      : colorTokens.ocean[700],
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            {t("allSubmissions")}
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────
// EMPTY STATE SUB-COMPONENT
// ─────────────────────────────────────────────────────────
function EmptyState({
  isDark,
  ext,
  t,
}: {
  isDark: boolean;
  ext: typeof extendedPalette.light | typeof extendedPalette.dark;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: `1px solid ${ext.border.light}`,
        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Decorative gradient bar */}
      <Box
        sx={{
          height: 4,
          background: colorTokens.gradients.accent,
          opacity: 0.6,
        }}
      />

      <Box sx={{ py: 10, px: 3, textAlign: "center" }}>
        {/* Animated icon */}
        <Box
          sx={{
            width: 88,
            height: 88,
            mx: "auto",
            mb: 3,
            borderRadius: 1,
            border: `2px dashed ${ext.border.main}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-8px)" },
            },
          }}
        >
          <InboxRoundedIcon
            sx={{
              fontSize: 42,
              color: isDark
                ? colorTokens.ocean[400]
                : colorTokens.ocean[500],
              opacity: 0.4,
            }}
          />

          {/* Decorative dots */}
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: colorTokens.ocean[isDark ? 400 : 500],
                opacity: 0.2,
                top: -8 + i * 4,
                right: -4 + i * 8,
                animation: `pulse ${1.5 + i * 0.3}s ease-in-out infinite`,
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 0.2, transform: "scale(1)" },
                  "50%": { opacity: 0.5, transform: "scale(1.3)" },
                },
              }}
            />
          ))}
        </Box>

        <Typography
          variant="h6"
          fontWeight={800}
          gutterBottom
          sx={{ letterSpacing: "-0.02em" }}
        >
          {t("noResponsesYet")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 340,
            mx: "auto",
            lineHeight: 1.7,
            mb: 3,
          }}
        >
          {t("shareFormToGetResponses")}
        </Typography>

        <Button
          variant="contained"
          startIcon={<ShareRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
            fontWeight: 700,
            fontSize: "0.8125rem",
            background: colorTokens.gradients.accent,
            boxShadow: `0 2px 12px ${colorTokens.ocean[500]}30`,
            "&:hover": {
              background: colorTokens.gradients.accent,
              transform: "translateY(-1px)",
              boxShadow: `0 6px 20px ${colorTokens.ocean[500]}40`,
            },
          }}
        >
          Share Form Link
        </Button>
      </Box>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
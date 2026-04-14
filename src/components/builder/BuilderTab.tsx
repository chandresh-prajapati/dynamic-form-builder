import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import { BuilderFieldList } from "./BuilderFieldList";
import { colorTokens, extendedPalette } from "@/theme/palette";
import { useI18n } from "@/hooks/useI18n";
import type { FormField } from "@/types/form";

interface BuilderTabProps {
  fields: FormField[];
  onRequestDelete: (id: string) => void;
  onOpenFieldSettings: (id: string) => void;
}

export function BuilderTab({
  fields,
  onRequestDelete,
  onOpenFieldSettings,
}: BuilderTabProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} alignItems="flex-start">
      {/* Main Builder Panel */}
      <Box sx={{ flex: 1, width: "100%" }}>
        <Card
          sx={{
            borderRadius: 1,
            border: `1px solid ${ext.border.light}`,
            boxShadow: isDark
              ? "0 2px 16px rgba(0,0,0,0.25)"
              : "0 2px 16px rgba(76,110,245,0.06)",
            overflow: "visible",
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: `1px solid ${ext.border.light}`,
              background: isDark
                ? `linear-gradient(135deg, ${colorTokens.slate[800]}, ${colorTokens.slate[900]})`
                : `linear-gradient(135deg, ${colorTokens.slate[50]}, #ffffff)`,
              borderRadius: "12px 12px 0 0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: colorTokens.gradients.accent,
              }}
            >
              <WidgetsRoundedIcon sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {t("fields")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {fields.length === 0
                  ? t("noFieldsYet")
                  : `${fields.length} ${t("fieldsAdded")}`}
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: 2.5 }}>
            {/* Hint Banner */}
            {fields.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  mb: 2,
                  borderRadius: 1,
                  bgcolor: ext.accent.infoSoft,
                  border: `1px solid ${colorTokens.status.info.main}25`,
                }}
              >
                <InfoOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: isDark
                      ? colorTokens.status.info.light
                      : colorTokens.status.info.dark,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark
                      ? colorTokens.status.info.light
                      : colorTokens.status.info.dark,
                    fontWeight: 500,
                  }}
                >
                  {t("reloadHint")}
                </Typography>
              </Box>
            )}

            {/* Empty State */}
            {fields.length === 0 ? (
              <EmptyBuilderState isDark={isDark} ext={ext} t={t} />
            ) : (
              <BuilderFieldList
                onRequestDelete={onRequestDelete}
                onOpenFieldSettings={onOpenFieldSettings}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Stats Sidebar (shows when fields exist) */}
      {fields.length > 0 && (
        <FieldStatsSidebar fields={fields} isDark={isDark} ext={ext} t={t} />
      )}
    </Stack>
  );
}

// ─── Empty State ──────────────────────────────────────
function EmptyBuilderState({
  isDark,
  ext,
  t,
}: {
  isDark: boolean;
  ext: typeof extendedPalette.light | typeof extendedPalette.dark;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
        borderRadius: 1.5,
        border: `2px dashed ${ext.border.light}`,
        background: isDark
          ? "rgba(255,255,255,0.01)"
          : "rgba(76,110,245,0.01)",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          mx: "auto",
          mb: 2,
          borderRadius: 1.5,
          background: colorTokens.gradients.card,
          border: `1px solid ${ext.border.light}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <WidgetsRoundedIcon
          sx={{
            fontSize: 36,
            color: isDark ? colorTokens.ocean[400] : colorTokens.ocean[500],
            opacity: 0.5,
          }}
        />
      </Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {t("noFieldsYet")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, mx: "auto" }}>
        {t("addFieldsToStart")}
      </Typography>
    </Box>
  );
}

// ─── Stats Sidebar ────────────────────────────────────
function FieldStatsSidebar({
  fields,
  isDark,
  ext,
  t,
}: {
  fields: FormField[];
  isDark: boolean;
  ext: typeof extendedPalette.light | typeof extendedPalette.dark;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const requiredCount = fields.filter((f) => f.required).length;
  const optionalCount = fields.length - requiredCount;

  const stats = [
    {
      label: t("totalFields"),
      value: fields.length,
      color: colorTokens.ocean[isDark ? 400 : 600],
      bg: ext.accent.primarySoft,
    },
    {
      label: t("required"),
      value: requiredCount,
      color: colorTokens.status.error.main,
      bg: ext.accent.errorSoft,
    },
    {
      label: t("optional"),
      value: optionalCount,
      color: colorTokens.status.success.main,
      bg: ext.accent.successSoft,
    },
  ];

  return (
    <Box sx={{ width: { xs: "100%", md: 200 }, flexShrink: 0 }}>
      <Stack spacing={1.5}>
        <Typography
          variant="overline"
          sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: 1.5,
            color: "text.secondary",
            px: 1,
          }}
        >
          {t("overview")}
        </Typography>
        {stats.map((s) => (
          <Card
            key={s.label}
            sx={{
              borderRadius: 1.5,
              border: `1px solid ${ext.border.light}`,
              boxShadow: "none",
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              "&:hover": { transform: "none" }, // disable default hover
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ fontWeight: 800, fontSize: "1rem", color: s.color }}
              >
                {s.value}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary", lineHeight: 1.3 }}
            >
              {s.label}
            </Typography>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
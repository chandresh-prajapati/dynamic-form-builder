import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  useTheme,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import { FormRenderer } from "@/components/FormRenderer";
import { colorTokens, extendedPalette } from "@/theme/palette";
import { useI18n } from "@/hooks/useI18n";
import type { FormSchema } from "@/types/form";

interface PreviewTabProps {
  schema: FormSchema;
  fieldsSig: string;
  onPreviewSubmit: () => void;
}

export function PreviewTab({
  schema,
  fieldsSig,
  onPreviewSubmit,
}: PreviewTabProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  return (
    <Box>
      {/* Preview Banner */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 2.5,
          p: 2,
          borderRadius: 1,
          background: isDark
            ? `linear-gradient(135deg, ${colorTokens.slate[800]}, ${colorTokens.slate[900]})`
            : `linear-gradient(135deg, ${colorTokens.ocean[50]}, ${colorTokens.teal[50]})`,
          border: `1px solid ${ext.border.light}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              background: colorTokens.gradients.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VisibilityRoundedIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {t("previewMode")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("previewModeHint")}
            </Typography>
          </Box>
        </Box>
        <Chip
          icon={<DevicesRoundedIcon sx={{ fontSize: "14px !important" }} />}
          label={t("livePreview")}
          size="small"
          sx={{
            bgcolor: ext.accent.primarySoft,
            color: isDark ? colorTokens.ocean[300] : colorTokens.ocean[700],
            fontWeight: 600,
            fontSize: "0.7rem",
            "& .MuiChip-icon": { color: "inherit" },
          }}
        />
      </Box>

      {/* Form Card */}
      <Card
        sx={{
          borderRadius: 1,
          border: `1px solid ${ext.border.light}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.3)"
            : "0 4px 24px rgba(76,110,245,0.06)",
          overflow: "hidden",
          mx: "auto",
        }}
      >
        {/* Form Header */}
        <Box
          sx={{
            px: 4,
            py: 3,
            background: colorTokens.gradients.accent,
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="white"
              gutterBottom
              sx={{ letterSpacing: "-0.02em" }}
            >
              {schema.title || t("untitledForm")}
            </Typography>
            {schema.description && (
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}
              >
                {schema.description}
              </Typography>
            )}
          </Box>
          <Chip
            label={`${schema.fields.length} ${t("fields")}`}
            size="small"
            sx={{
              mt: 1.5,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.7rem",
              backdropFilter: "blur(4px)",
            }}
          />
        </Box>

        {/* Form Content */}
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <FormRenderer
            key={fieldsSig}
            schema={schema}
            preview
            onPreviewSubmit={onPreviewSubmit}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
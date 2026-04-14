import { RefObject } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import AutoSaveIcon from "@mui/icons-material/CloudDoneRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import { AddFieldMenu } from "./AddFieldMenu";
import { colorTokens, extendedPalette } from "@/theme/palette";
import { useI18n } from "@/hooks/useI18n";
import type { FormSchema } from "@/types/form";

interface DashboardHeaderProps {
  schema: FormSchema;
  isSaving: boolean;
  autoSaved: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSave: () => void;
  onShare: () => void;
  onExport: () => void;
  onImportClick: () => void;
  onFileChange: (file: File) => void;
}

export function DashboardHeader({
  schema,
  isSaving,
  autoSaved,
  fileInputRef,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onShare,
  onExport,
  onImportClick,
  onFileChange,
}: DashboardHeaderProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const isEmpty = schema.fields.length === 0;

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 2, sm: 3 },
        borderRadius: 1,
        border: `1px solid ${ext.border.light}`,
        background: isDark
          ? `linear-gradient(145deg, ${colorTokens.slate[900]}, ${colorTokens.slate[800]})`
          : `linear-gradient(145deg, #ffffff, ${colorTokens.slate[50]})`,
        boxShadow: isDark
          ? "0 4px 24px rgba(0,0,0,0.3)"
          : "0 4px 24px rgba(76,110,245,0.06)",
      }}
    >
      {/* Top Row: Title + Status + Actions */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={2.5}
      >
        {/* Left: Page Title */}
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              background: isDark
                ? `linear-gradient(135deg, ${colorTokens.ocean[300]}, ${colorTokens.teal[300]})`
                : colorTokens.gradients.accent,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {t("formBuilder")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            {schema.fields.length === 0
              ? t("addFieldsToStart")
              : `${schema.fields.length} ${t("fields")}`}
          </Typography>
        </Box>

        {/* Right: Status + Action Buttons */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {/* Auto-save status */}
          <AutoSaveStatus isSaving={isSaving} autoSaved={autoSaved} isDark={isDark} />

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Import */}
          <Tooltip title={t("importJson")} arrow>
            <IconButton
              onClick={onImportClick}
              size="small"
              sx={iconBtnStyles(ext, isDark)}
            >
              <FileUploadRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Export */}
          <Tooltip title={t("exportJson")} arrow>
            <IconButton
              onClick={onExport}
              size="small"
              disabled={isEmpty}
              sx={iconBtnStyles(ext, isDark)}
            >
              <FileDownloadRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Share */}
          <Tooltip title={t("share")} arrow>
            <IconButton
              onClick={onShare}
              size="small"
              disabled={isEmpty}
              sx={iconBtnStyles(ext, isDark)}
            >
              <ShareRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Save Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={
              isSaving ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <SaveRoundedIcon fontSize="small" />
              )
            }
            onClick={onSave}
            disabled={isSaving || isEmpty}
            sx={{
              px: 2.5,
              py: 0.9,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: "0.8125rem",
              background: isEmpty
                ? undefined
                : colorTokens.gradients.accent,
              boxShadow: isEmpty
                ? "none"
                : `0 2px 12px ${colorTokens.ocean[500]}35`,
              "&:hover": {
                background: isEmpty
                  ? undefined
                  : colorTokens.gradients.accent,
                transform: "translateY(-1px)",
                boxShadow: `0 6px 20px ${colorTokens.ocean[500]}45`,
              },
              "&:active": { transform: "translateY(0)" },
              transition: "all 0.2s ease",
            }}
          >
            {isSaving ? t("saving") : t("save")}
          </Button>
        </Stack>
      </Stack>

      {/* Bottom Row: Form Fields + Add Field */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        {/* Form Title Field */}
        <TextField
          size="small"
          label={t("formTitle")}
          value={schema.title}
          onChange={(e) => onTitleChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <EditIcon
                sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }}
              />
            ),
          }}
          sx={{
            minWidth: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              bgcolor: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.8)",
            },
          }}
        />

        {/* Description Field */}
        <TextField
          size="small"
          label={t("description")}
          value={schema.description ?? ""}
          onChange={(e) => onDescriptionChange(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              bgcolor: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.8)",
            },
          }}
        />

        {/* Add Field */}
        <AddFieldMenu />
      </Stack>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
          e.target.value = "";
        }}
      />
    </Box>
  );
}

// ─── Sub-components ──────────────────────────────────
function AutoSaveStatus({
  isSaving,
  autoSaved,
  isDark,
}: {
  isSaving: boolean;
  autoSaved: boolean;
  isDark: boolean;
}) {
  if (isSaving) {
    return (
      <Chip
        size="small"
        icon={<CircularProgress size={10} />}
        label="Saving…"
        sx={{
          fontSize: "0.7rem",
          fontWeight: 600,
          bgcolor: isDark
            ? colorTokens.status.info.bgDark
            : colorTokens.status.info.bg,
          color: isDark
            ? colorTokens.status.info.light
            : colorTokens.status.info.dark,
          border: `1px solid ${colorTokens.status.info.main}30`,
        }}
      />
    );
  }

  if (autoSaved) {
    return (
      <Chip
        size="small"
        icon={<AutoSaveIcon sx={{ fontSize: "12px !important" }} />}
        label="Auto-saved"
        sx={{
          fontSize: "0.7rem",
          fontWeight: 600,
          bgcolor: isDark
            ? colorTokens.status.success.bgDark
            : colorTokens.status.success.bg,
          color: isDark
            ? colorTokens.status.success.light
            : colorTokens.status.success.dark,
          border: `1px solid ${colorTokens.status.success.main}30`,
          "& .MuiChip-icon": { color: "inherit" },
        }}
      />
    );
  }

  return null;
}

// ─── Shared Styles ────────────────────────────────────
function iconBtnStyles(ext: typeof extendedPalette.light | typeof extendedPalette.dark, isDark: boolean) {
  return {
    width: 36,
    height: 36,
    borderRadius: 1,
    border: `1px solid ${ext.border.light}`,
    bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
    color: "text.secondary",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: colorTokens.ocean[isDark ? 400 : 500],
      color: isDark ? colorTokens.ocean[400] : colorTokens.ocean[600],
      bgcolor: ext.accent.primarySoft,
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      opacity: 0.4,
      transform: "none",
    },
  } as const;
}
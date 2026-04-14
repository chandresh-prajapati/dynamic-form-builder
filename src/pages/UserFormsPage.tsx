import { useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

// ─── Icons ────────────────────────────────────────────
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { useAllFormsQuery, useDeleteFormMutation } from "@/hooks/useFormApi";
import { useI18n } from "@/hooks/useI18n";
import { useUiStore } from "@/store/uiStore";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { colorTokens, extendedPalette } from "@/theme/palette";
import type { FormSchema } from "@/types/form";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
type SortKey = "updatedAt" | "title" | "fields";
type ViewMode = "grid" | "list";

// ─────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function getFormColor(id: string): string {
  const colors = [
    colorTokens.ocean[600],
    colorTokens.teal[500],
    "#8B5CF6",
    "#EC4899",
    colorTokens.coral[500],
    "#F59E0B",
    "#10B981",
    "#3B82F6",
  ];
  const index = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

// ─────────────────────────────────────────────────────────
// DELETE CONFIRM DIALOG
// ─────────────────────────────────────────────────────────
interface DeleteDialogProps {
  open: boolean;
  formTitle: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmDialog({
  open,
  formTitle,
  isPending,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          border: `1px solid ${ext.border.light}`,
          boxShadow: isDark
            ? "0 24px 48px rgba(0,0,0,0.5)"
            : "0 24px 48px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Icon header */}
      <Box
        sx={{
          pt: 3.5,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 1,
            bgcolor: isDark
              ? colorTokens.status.error.bgDark
              : colorTokens.status.error.bg,
            border: `1px solid ${colorTokens.status.error.main}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WarningAmberRoundedIcon
            sx={{
              fontSize: 28,
              color: colorTokens.status.error.main,
            }}
          />
        </Box>
      </Box>

      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "1.1rem",
          pb: 0.5,
          pt: 1,
          letterSpacing: "-0.02em",
        }}
      >
        Delete Form?
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          You're about to permanently delete{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              bgcolor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
              px: 0.75,
              py: 0.2,
              borderRadius: 1,
              fontFamily: "monospace",
              fontSize: "0.85em",
            }}
          >
            {formTitle}
          </Box>
          {" "}and all its responses. This cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onCancel}
          disabled={isPending}
          sx={{
            borderRadius: 1,
            fontWeight: 600,
            py: 1,
            borderWidth: "1.5px",
            "&:hover": { borderWidth: "1.5px" },
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={onConfirm}
          disabled={isPending}
          startIcon={
            isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteRoundedIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            borderRadius: 1,
            fontWeight: 700,
            py: 1,
            bgcolor: colorTokens.status.error.main,
            "&:hover": {
              bgcolor: colorTokens.status.error.dark,
              transform: "translateY(-1px)",
              boxShadow: `0 6px 20px ${colorTokens.status.error.main}40`,
            },
            "&:active": { transform: "translateY(0)" },
          }}
        >
          {isPending ? "Deleting…" : "Delete Form"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────
// FORM CARD SKELETON
// ─────────────────────────────────────────────────────────
function FormCardSkeleton({ viewMode }: { viewMode: ViewMode }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  if (viewMode === "list") {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${ext.border.light}`,
          p: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="60%" height={18} />
          </Box>
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: `1px solid ${ext.border.light}`,
        overflow: "hidden",
      }}
    >
      <Skeleton variant="rectangular" height={80} />
      <Box sx={{ p: 1 }}>
        <Skeleton variant="text" width="70%" height={28} />
        <Skeleton variant="text" width="90%" height={20} />
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 1.5 }} />
          <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 1.5 }} />
        </Stack>
      </Box>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// FORM CARD (Grid Mode)
// ─────────────────────────────────────────────────────────
interface FormCardProps {
  form: FormSchema;
  isAdmin: boolean;
  isPendingDelete: boolean;
  onEdit: (form: FormSchema) => void;
  onDelete: (form: FormSchema) => void;
  onShare: (form: FormSchema) => void;
}

function FormCard({
  form,
  isAdmin,
  isPendingDelete,
  onEdit,
  onDelete,
  onShare,
}: FormCardProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;
  const accentColor = getFormColor(form.id);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: `1px solid ${ext.border.light}`,
        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          borderColor: `${accentColor}50`,
          boxShadow: `0 8px 32px ${accentColor}12`,
          transform: "translateY(-3px)",
          "& .form-actions": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Colored header */}
      <Box
        sx={{
          height: 6,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
        }}
      />

      {/* Card Content */}
      <Box sx={{ p: 1, flex: 1 }}>
        {/* Icon + Title row */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${accentColor}15`,
              border: `1px solid ${accentColor}25`,
            }}
          >
            <DescriptionRoundedIcon sx={{ fontSize: 22, color: accentColor }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              noWrap
              sx={{
                fontSize: "0.9375rem",
                letterSpacing: "-0.01em",
                color: "text.primary",
              }}
            >
              {form.title}
            </Typography>
            {form.description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.5,
                  fontSize: "0.75rem",
                }}
              >
                {form.description}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Stats chips */}
        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ gap: 0.75 }}>
          <Chip
            icon={<WidgetsRoundedIcon sx={{ fontSize: "12px !important" }} />}
            label={`${form.fields.length} fields`}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.68rem",
              fontWeight: 600,
              bgcolor: `${accentColor}12`,
              color: accentColor,
              border: `1px solid ${accentColor}20`,
              "& .MuiChip-icon": { color: "inherit" },
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
          <Chip
            icon={<AccessTimeRoundedIcon sx={{ fontSize: "12px !important" }} />}
            label={formatRelativeTime(form.updatedAt)}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.68rem",
              fontWeight: 500,
              bgcolor: isDark ? "rgba(255,255,255,0.04)" : colorTokens.slate[100],
              color: "text.secondary",
              "& .MuiChip-icon": { color: "inherit" },
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Stack>
      </Box>

      <Divider sx={{ borderColor: ext.border.light }} />

      {/* Actions */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Open button */}
          <Button
            component={Link}
            to={`/fill/${form.id}`}
            variant="contained"
            size="small"
            startIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              px: 2,
              py: 0.7,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: "0.75rem",
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              boxShadow: `0 2px 8px ${accentColor}30`,
              "&:hover": {
                background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor}aa)`,
                boxShadow: `0 4px 16px ${accentColor}40`,
                transform: "translateY(-1px)",
              },
            }}
          >
            {t("openForm")}
          </Button>

          {/* Admin actions */}
          {isAdmin && (
            <Stack
              className="form-actions"
              direction="row"
              spacing={0}
              sx={{
                opacity: { xs: 1, md: 0.5 },
                transform: { xs: "none", md: "translateY(2px)" },
                transition: "all 0.2s ease",
              }}
            >
              <Tooltip title="Share link" arrow>
                <IconButton
                  size="small"
                  onClick={() => onShare(form)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: isDark
                        ? "rgba(59,130,246,0.12)"
                        : "rgba(59,130,246,0.08)",
                      color: "#3B82F6",
                    },
                  }}
                >
                  <ShareRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("edit")} arrow>
                <IconButton
                  size="small"
                  onClick={() => onEdit(form)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: `${accentColor}12`,
                      color: accentColor,
                    },
                  }}
                >
                  <EditRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("delete")} arrow>
                <IconButton
                  size="small"
                  disabled={isPendingDelete}
                  onClick={() => onDelete(form)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: isDark
                        ? colorTokens.status.error.bgDark
                        : colorTokens.status.error.bg,
                      color: colorTokens.status.error.main,
                    },
                    "&.Mui-disabled": { opacity: 0.4 },
                  }}
                >
                  {isPendingDelete ? (
                    <CircularProgress size={14} />
                  ) : (
                    <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Box>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// FORM LIST ROW (List Mode)
// ─────────────────────────────────────────────────────────
function FormListRow({
  form,
  isAdmin,
  isPendingDelete,
  onEdit,
  onDelete,
  onShare,
}: FormCardProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;
  const accentColor = getFormColor(form.id);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: `1px solid ${ext.border.light}`,
        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: `${accentColor}40`,
          boxShadow: `0 4px 16px ${accentColor}08`,
          "& .list-actions": { opacity: 1 },
        },
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ p: 0 }}>
        {/* Color bar */}
        <Box
          sx={{
            width: 4,
            alignSelf: "stretch",
            bgcolor: accentColor,
            flexShrink: 0,
          }}
        />

        {/* Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            mx: 2,
            my: 1.5,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${accentColor}15`,
            border: `1px solid ${accentColor}20`,
            flexShrink: 0,
          }}
        >
          <DescriptionRoundedIcon sx={{ fontSize: 22, color: accentColor }} />
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1, minWidth: 0, py: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              fontWeight={700}
              noWrap
              sx={{ fontSize: "0.9rem", letterSpacing: "-0.01em" }}
            >
              {form.title}
            </Typography>
            <Chip
              label={`${form.fields.length} fields`}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.62rem",
                fontWeight: 700,
                bgcolor: `${accentColor}12`,
                color: accentColor,
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          </Stack>
          {form.description && (
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ fontSize: "0.75rem", display: "block", mt: 0.2 }}
            >
              {form.description}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.68rem" }}
          >
            Updated {formatRelativeTime(form.updatedAt)}
          </Typography>
        </Box>

        {/* Actions */}
        <Stack
          className="list-actions"
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            px: 2,
            opacity: { xs: 1, md: 0.6 },
            transition: "opacity 0.2s ease",
          }}
        >
          <Button
            component={Link}
            to={`/fill/${form.id}`}
            variant="contained"
            size="small"
            startIcon={<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />}
            sx={{
              px: 1.5,
              py: 0.6,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: "0.75rem",
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              boxShadow: `0 2px 8px ${accentColor}25`,
              "&:hover": {
                background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor}aa)`,
                transform: "translateY(-1px)",
              },
            }}
          >
            {t("openForm")}
          </Button>

          {isAdmin && (
            <>
              <Tooltip title="Share" arrow>
                <IconButton
                  size="small"
                  onClick={() => onShare(form)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: "rgba(59,130,246,0.08)",
                      color: "#3B82F6",
                    },
                  }}
                >
                  <ShareRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("edit")} arrow>
                <IconButton
                  size="small"
                  onClick={() => onEdit(form)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: `${accentColor}12`,
                      color: accentColor,
                    },
                  }}
                >
                  <EditRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("delete")} arrow>
                <IconButton
                  size="small"
                  disabled={isPendingDelete}
                  onClick={() => onDelete(form)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: isDark
                        ? colorTokens.status.error.bgDark
                        : colorTokens.status.error.bg,
                      color: colorTokens.status.error.main,
                    },
                  }}
                >
                  {isPendingDelete ? (
                    <CircularProgress size={14} />
                  ) : (
                    <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────
function EmptyState({
  isAdmin,
  onCreateNew,
}: {
  isAdmin: boolean;
  onCreateNew: () => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: `1px solid ${ext.border.light}`,
        bgcolor: isDark ? "rgba(255,255,255,0.01)" : "#ffffff",
        overflow: "hidden",
        mt: 2,
      }}
    >
      <Box
        sx={{
          height: 4,
          background: colorTokens.gradients.accent,
          opacity: 0.5,
        }}
      />
      <Box sx={{ py: 10, px: 3, textAlign: "center" }}>
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
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-8px)" },
            },
          }}
        >
          <DescriptionRoundedIcon
            sx={{
              fontSize: 42,
              color: isDark ? colorTokens.ocean[400] : colorTokens.ocean[500],
              opacity: 0.35,
            }}
          />
        </Box>
        <Typography
          variant="h6"
          fontWeight={800}
          gutterBottom
          sx={{ letterSpacing: "-0.02em" }}
        >
          No Published Forms Yet
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 320, mx: "auto", mb: 3, lineHeight: 1.7 }}
        >
          {isAdmin
            ? "Create your first form in the Form Builder and save it to see it here."
            : "No forms have been published yet. Check back later."}
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={onCreateNew}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: "0.875rem",
              background: colorTokens.gradients.accent,
              boxShadow: `0 2px 12px ${colorTokens.ocean[500]}30`,
              "&:hover": {
                background: colorTokens.gradients.accent,
                transform: "translateY(-1px)",
                boxShadow: `0 6px 20px ${colorTokens.ocean[500]}40`,
              },
            }}
          >
            Create Your First Form
          </Button>
        )}
      </Box>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export function UserFormsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const role = useUiStore((s) => s.role);
  const isAdmin = role === "admin";
  const loadFromRemote = useFormBuilderStore((s) => s.loadFromRemote);
  const q = useAllFormsQuery();
  const deleteMutation = useDeleteFormMutation();

  // ─── Local State ─────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [deleteTarget, setDeleteTarget] = useState<FormSchema | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ─── Sorted + Filtered ───────────────────────────────
  const processedForms = useMemo(() => {
    const list = q.data ?? [];

    const filtered = searchQuery.trim()
      ? list.filter(
        (f) =>
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : list;

    return [...filtered].sort((a, b) => {
      if (sortKey === "updatedAt") return b.updatedAt.localeCompare(a.updatedAt);
      if (sortKey === "title") return a.title.localeCompare(b.title);
      if (sortKey === "fields") return b.fields.length - a.fields.length;
      return 0;
    });
  }, [q.data, searchQuery, sortKey]);

  // ─── Handlers ────────────────────────────────────────
  const handleEdit = useCallback(
    (form: FormSchema) => {
      loadFromRemote(form);
      navigate("/admin");
    },
    [loadFromRemote, navigate]
  );

  const handleDeleteRequest = useCallback((form: FormSchema) => {
    setDeleteTarget(form);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteMutation]);

  const handleShare = useCallback(async (form: FormSchema) => {
    const url = `${window.location.origin}/fill/${form.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(form.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      console.error("Clipboard failed");
    }
  }, []);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;
  const totalCount = q.data?.length ?? 0;

  // ─── Loading State ───────────────────────────────────
  if (q.isLoading) {
    return (
      <Box>
        <PageHeader
          t={t}
          isAdmin={isAdmin}
          totalCount={0}
          isLoading
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortKey={sortKey}
          setSortKey={setSortKey}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCreateNew={() => navigate("/admin")}
          isDark={isDark}
          ext={ext}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              viewMode === "grid"
                ? { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }
                : "1fr",
            gap: 2,
            mt: 3,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <FormCardSkeleton key={i} viewMode={viewMode} />
          ))}
        </Box>
      </Box>
    );
  }

  // ─── Empty State ─────────────────────────────────────
  if (totalCount === 0) {
    return (
      <Box>
        <PageHeader
          t={t}
          isAdmin={isAdmin}
          totalCount={0}
          isLoading={false}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortKey={sortKey}
          setSortKey={setSortKey}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCreateNew={() => navigate("/admin")}
          isDark={isDark}
          ext={ext}
        />
        <EmptyState isAdmin={isAdmin} onCreateNew={() => navigate("/admin")} />
      </Box>
    );
  }

  // ─── Main Render ─────────────────────────────────────
  return (
    <Box>
      {/* Copied snackbar hint */}
      {copiedId && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2.5,
            py: 1.2,
            borderRadius: 1,
            bgcolor: isDark ? colorTokens.slate[700] : colorTokens.slate[800],
            color: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "slideUp 0.3s ease",
            "@keyframes slideUp": {
              from: { transform: "translateX(-50%) translateY(20px)", opacity: 0 },
              to: { transform: "translateX(-50%) translateY(0)", opacity: 1 },
            },
          }}
        >
          <CheckRoundedIcon sx={{ fontSize: 16, color: colorTokens.status.success.light }} />
          <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.8rem" }}>
            Link copied to clipboard!
          </Typography>
          <ContentCopyRoundedIcon sx={{ fontSize: 14, opacity: 0.6 }} />
        </Box>
      )}

      <PageHeader
        t={t}
        isAdmin={isAdmin}
        totalCount={totalCount}
        isLoading={q.isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortKey={sortKey}
        setSortKey={setSortKey}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateNew={() => navigate("/admin")}
        isDark={isDark}
        ext={ext}
      />

      {/* Search result count */}
      {searchQuery && (
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ display: "block", mb: 2 }}
        >
          {processedForms.length} result{processedForms.length !== 1 ? "s" : ""} for "
          {searchQuery}"
        </Typography>
      )}

      {/* Form Grid / List */}
      {processedForms.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <SearchRoundedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            No forms match "{searchQuery}"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different search term
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              viewMode === "grid"
                ? {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }
                : "1fr",
            gap: 2,
          }}
        >
          {processedForms.map((form) =>
            viewMode === "grid" ? (
              <FormCard
                key={form.id}
                form={form}
                isAdmin={isAdmin}
                isPendingDelete={
                  deleteMutation.isPending && deleteTarget?.id === form.id
                }
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                onShare={handleShare}
              />
            ) : (
              <FormListRow
                key={form.id}
                form={form}
                isAdmin={isAdmin}
                isPendingDelete={
                  deleteMutation.isPending && deleteTarget?.id === form.id
                }
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                onShare={handleShare}
              />
            )
          )}
        </Box>
      )}

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        formTitle={deleteTarget?.title ?? ""}
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────
// PAGE HEADER SUB-COMPONENT
// ─────────────────────────────────────────────────────────
interface PageHeaderProps {
  t: ReturnType<typeof useI18n>["t"];
  isAdmin: boolean;
  totalCount: number;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  onCreateNew: () => void;
  isDark: boolean;
  ext: typeof extendedPalette.light | typeof extendedPalette.dark;
}

function PageHeader({
  t,
  isAdmin,
  totalCount,
  isLoading,
  searchQuery,
  setSearchQuery,
  sortKey,
  setSortKey,
  viewMode,
  setViewMode,
  onCreateNew,
  isDark,
  ext,
}: PageHeaderProps) {
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
      {/* Top row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={2.5}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5}>
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
              }}
            >
              {t("userDashboard")}
            </Typography>
            {!isLoading && totalCount > 0 && (
              <Chip
                label={totalCount}
                size="small"
                sx={{
                  height: 22,
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  bgcolor: isDark
                    ? colorTokens.ocean[400] + "20"
                    : colorTokens.ocean[600] + "12",
                  color: isDark ? colorTokens.ocean[300] : colorTokens.ocean[700],
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
            )}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
              {isAdmin ? "Admin view" : "Published forms"}
            </Typography>
            {isAdmin && (
              <Chip
                icon={<AdminPanelSettingsRoundedIcon sx={{ fontSize: "12px !important" }} />}
                label="Admin"
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  bgcolor: isDark
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(239,68,68,0.08)",
                  color: colorTokens.status.error.main,
                  "& .MuiChip-icon": { color: "inherit" },
                  "& .MuiChip-label": { px: 0.5 },
                }}
              />
            )}
          </Stack>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={onCreateNew}
            sx={{
              px: 2.5,
              py: 0.9,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: "0.8125rem",
              background: colorTokens.gradients.accent,
              boxShadow: `0 2px 12px ${colorTokens.ocean[500]}30`,
              flexShrink: 0,
              "&:hover": {
                background: colorTokens.gradients.accent,
                transform: "translateY(-1px)",
                boxShadow: `0 6px 20px ${colorTokens.ocean[500]}45`,
              },
              "&:active": { transform: "translateY(0)" },
            }}
          >
            New Form
          </Button>
        )}
      </Stack>

      {/* Toolbar row */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
            },
          }}
        />

        <Stack direction="row" spacing={0.75} alignItems="center">
          {/* Sort */}
          <Select
            size="small"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            startAdornment={
              <SortRoundedIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
            }
            sx={{
              borderRadius: 1,
              fontSize: "0.8125rem",
              fontWeight: 600,
              minWidth: 140,
              bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: ext.border.light,
              },
            }}
          >
            <MenuItem value="updatedAt">
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />
                <span>Last Updated</span>
              </Stack>
            </MenuItem>
            <MenuItem value="title">
              <Stack direction="row" spacing={1} alignItems="center">
                <DescriptionRoundedIcon sx={{ fontSize: 16 }} />
                <span>Alphabetical</span>
              </Stack>
            </MenuItem>
            <MenuItem value="fields">
              <Stack direction="row" spacing={1} alignItems="center">
                <BarChartRoundedIcon sx={{ fontSize: 16 }} />
                <span>Most Fields</span>
              </Stack>
            </MenuItem>
          </Select>

          {/* View Toggle */}
          <Box
            sx={{
              display: "flex",
              borderRadius: 1,
              border: `1px solid ${ext.border.light}`,
              overflow: "hidden",
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
            }}
          >
            {[
              { mode: "grid" as ViewMode, icon: GridViewRoundedIcon, tip: "Grid view" },
              { mode: "list" as ViewMode, icon: FormatListBulletedRoundedIcon, tip: "List view" },
            ].map(({ mode, icon: Icon, tip }) => (
              <Tooltip key={mode} title={tip} arrow>
                <IconButton
                  size="small"
                  onClick={() => setViewMode(mode)}
                  sx={{
                    borderRadius: 0,
                    width: 36,
                    height: 36,
                    bgcolor:
                      viewMode === mode
                        ? isDark
                          ? colorTokens.ocean[400] + "20"
                          : colorTokens.ocean[600] + "10"
                        : "transparent",
                    color:
                      viewMode === mode
                        ? isDark
                          ? colorTokens.ocean[300]
                          : colorTokens.ocean[700]
                        : "text.secondary",
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
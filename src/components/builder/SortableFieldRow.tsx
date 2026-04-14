import { memo, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { sortableTransformToCss } from "@/utils/sortableTransform";
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

// ─── Icons ───────────────────────────────────────────
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import ArrowDropDownCircleRoundedIcon from "@mui/icons-material/ArrowDropDownCircleRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AsteriskIcon from "@mui/icons-material/Emergency";

import { useI18n } from "@/hooks/useI18n";
import { colorTokens, extendedPalette } from "@/theme/palette";
import type { FormField } from "@/types/form";

// ─────────────────────────────────────────────────────────
// FIELD TYPE CONFIGURATION
// ─────────────────────────────────────────────────────────
const FIELD_TYPE_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
    bgLight: string;
    bgDark: string;
    label: string;
  }
> = {
  text: {
    icon: TextFieldsRoundedIcon,
    color: colorTokens.ocean[600],
    bgLight: `${colorTokens.ocean[600]}12`,
    bgDark: `${colorTokens.ocean[400]}18`,
    label: "Text",
  },
  email: {
    icon: EmailRoundedIcon,
    color: "#0EA5E9",
    bgLight: "rgba(14, 165, 233, 0.1)",
    bgDark: "rgba(14, 165, 233, 0.15)",
    label: "Email",
  },
  password: {
    icon: PasswordRoundedIcon,
    color: "#8B5CF6",
    bgLight: "rgba(139, 92, 246, 0.1)",
    bgDark: "rgba(139, 92, 246, 0.15)",
    label: "Password",
  },
  textarea: {
    icon: NotesRoundedIcon,
    color: colorTokens.teal[500],
    bgLight: `${colorTokens.teal[500]}12`,
    bgDark: `${colorTokens.teal[400]}18`,
    label: "Textarea",
  },
  number: {
    icon: NumbersRoundedIcon,
    color: "#F59E0B",
    bgLight: "rgba(245, 158, 11, 0.1)",
    bgDark: "rgba(245, 158, 11, 0.15)",
    label: "Number",
  },
  select: {
    icon: ArrowDropDownCircleRoundedIcon,
    color: "#EC4899",
    bgLight: "rgba(236, 72, 153, 0.1)",
    bgDark: "rgba(236, 72, 153, 0.15)",
    label: "Select",
  },
  radio: {
    icon: RadioButtonCheckedRoundedIcon,
    color: "#14B8A6",
    bgLight: "rgba(20, 184, 166, 0.1)",
    bgDark: "rgba(20, 184, 166, 0.15)",
    label: "Radio",
  },
  checkbox: {
    icon: CheckBoxRoundedIcon,
    color: "#10B981",
    bgLight: "rgba(16, 185, 129, 0.1)",
    bgDark: "rgba(16, 185, 129, 0.15)",
    label: "Checkbox",
  },
  date: {
    icon: CalendarMonthRoundedIcon,
    color: "#F97316",
    bgLight: "rgba(249, 115, 22, 0.1)",
    bgDark: "rgba(249, 115, 22, 0.15)",
    label: "Date",
  },
  file: {
    icon: AttachFileRoundedIcon,
    color: "#6366F1",
    bgLight: "rgba(99, 102, 241, 0.1)",
    bgDark: "rgba(99, 102, 241, 0.15)",
    label: "File",
  },
};

const DEFAULT_CONFIG = {
  icon: TextFieldsRoundedIcon,
  color: "#64748B",
  bgLight: "rgba(100, 116, 139, 0.1)",
  bgDark: "rgba(100, 116, 139, 0.15)",
  label: "Field",
};

// ─────────────────────────────────────────────────────────
// COMPONENT PROPS
// ─────────────────────────────────────────────────────────
export interface SortableFieldRowProps {
  field: FormField;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpenSettings: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
export const SortableFieldRow = memo(function SortableFieldRow({
  field,
  selected,
  onSelect,
  onOpenSettings,
  onDuplicate,
  onDelete,
}: SortableFieldRowProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const config = FIELD_TYPE_CONFIG[field.type] ?? DEFAULT_CONFIG;
  const FieldIcon = config.icon;

  const style = {
    transform: sortableTransformToCss(transform),
    transition,
  };

  const stop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Count options for select/radio types
  const optionCount = field.options?.length ?? 0;
  const hasValidation = field.validation && Object.keys(field.validation).length > 0;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      elevation={0}
      sx={{
        mb: 1.5,
        borderRadius: 1,
        border: `1.5px solid`,
        borderColor: selected
          ? config.color
          : isDragging
            ? colorTokens.ocean[isDark ? 400 : 500]
            : ext.border.light,
        bgcolor: isDragging
          ? isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.95)"
          : selected
            ? isDark
              ? `${config.color}08`
              : `${config.color}05`
            : isDark
              ? "rgba(255,255,255,0.02)"
              : "#ffffff",
        boxShadow: isDragging
          ? `0 12px 40px ${config.color}25, 0 4px 12px rgba(0,0,0,0.1)`
          : selected
            ? `0 0 0 3px ${config.color}15, 0 2px 8px ${config.color}10`
            : "0 1px 3px rgba(0,0,0,0.02)",
        opacity: isDragging ? 0.92 : 1,
        transform: isDragging ? "scale(1.02)" : "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          borderColor: isDragging
            ? undefined
            : selected
              ? config.color
              : isDark
                ? colorTokens.slate[600]
                : colorTokens.slate[300],
          boxShadow: isDragging
            ? undefined
            : `0 4px 16px ${config.color}10`,
          "& .action-buttons": {
            opacity: 1,
            transform: "translateX(0)",
          },
          "& .drag-handle": {
            opacity: 1,
            bgcolor: isDark ? config.bgDark : config.bgLight,
          },
        },
      }}
    >
      {/* Selected accent line at top */}
      {selected && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
            borderRadius: "12px 12px 0 0",
          }}
        />
      )}

      <Stack direction="row" alignItems="stretch">
        {/* ─── Drag Handle ────────────────────────────────── */}
        <Box
          {...attributes}
          {...listeners}
          className="drag-handle"
          sx={{
            cursor: isDragging ? "grabbing" : "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 0.75,
            opacity: 0.5,
            bgcolor: isDark
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.01)",
            borderRight: `1px solid ${ext.border.light}`,
            transition: "all 0.2s ease",
            "&:hover": {
              opacity: 1,
              bgcolor: isDark ? config.bgDark : config.bgLight,
            },
            "&:active": {
              cursor: "grabbing",
            },
          }}
          role="button"
          aria-label="Drag to reorder"
        >
          <DragIndicatorRoundedIcon
            sx={{
              fontSize: 20,
              color: isDragging ? config.color : "text.disabled",
              transition: "color 0.2s ease",
            }}
          />
        </Box>

        {/* ─── Main Content ───────────────────────────────── */}
        <CardActionArea
          onClick={() => onSelect(field.id)}
          sx={{
            flex: 1,
            alignItems: "stretch",
            "&:hover .MuiCardActionArea-focusHighlight": {
              opacity: 0.03,
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ p: 1.5, width: "100%" }}
          >
            {/* Field Type Icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isDark ? config.bgDark : config.bgLight,
                border: `1px solid ${config.color}20`,
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
            >
              <FieldIcon
                sx={{ fontSize: 20, color: config.color }}
              />
            </Box>

            {/* Field Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography
                  fontWeight={700}
                  noWrap
                  sx={{
                    fontSize: "0.875rem",
                    color: selected
                      ? config.color
                      : "text.primary",
                    transition: "color 0.2s ease",
                  }}
                >
                  {field.label}
                </Typography>

                {/* Required indicator */}
                {field.required && (
                  <Tooltip title="Required field" arrow>
                    <AsteriskIcon
                      sx={{
                        fontSize: 12,
                        color: colorTokens.status.error.main,
                        flexShrink: 0,
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>

              {/* Meta info row */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{ mt: 0.25 }}
              >
                {/* Type chip */}
                <Chip
                  label={config.label}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    bgcolor: isDark ? config.bgDark : config.bgLight,
                    color: config.color,
                    border: "none",
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />

                {/* Option count for select/radio */}
                {(field.type === "select" || field.type === "radio") &&
                  optionCount > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.68rem" }}
                    >
                      {optionCount} option{optionCount > 1 ? "s" : ""}
                    </Typography>
                  )}

                {/* Placeholder preview */}
                {field.placeholder && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    noWrap
                    sx={{
                      fontSize: "0.68rem",
                      fontStyle: "italic",
                      maxWidth: 140,
                    }}
                  >
                    "{field.placeholder}"
                  </Typography>
                )}
              </Stack>
            </Box>

            {/* Status Badges */}
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ flexShrink: 0 }}
            >
              {/* Conditional visibility badge */}
              {field.visibility && (
                <Tooltip title="Has visibility condition" arrow>
                  <Chip
                    icon={
                      <VisibilityRoundedIcon
                        sx={{ fontSize: "12px !important" }}
                      />
                    }
                    label="Conditional"
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      bgcolor: isDark
                        ? "rgba(139, 92, 246, 0.15)"
                        : "rgba(139, 92, 246, 0.08)",
                      color: "#8B5CF6",
                      border: `1px solid rgba(139, 92, 246, 0.2)`,
                      "& .MuiChip-icon": { color: "inherit" },
                      "& .MuiChip-label": { px: 0.5 },
                    }}
                  />
                </Tooltip>
              )}

              {/* Validation badge */}
              {hasValidation && (
                <Tooltip title="Has validation rules" arrow>
                  <Chip
                    icon={
                      <LockRoundedIcon
                        sx={{ fontSize: "12px !important" }}
                      />
                    }
                    label="Validated"
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      bgcolor: isDark
                        ? colorTokens.status.warning.bgDark
                        : colorTokens.status.warning.bg,
                      color: isDark
                        ? colorTokens.status.warning.light
                        : colorTokens.status.warning.dark,
                      border: `1px solid ${colorTokens.status.warning.main}25`,
                      "& .MuiChip-icon": { color: "inherit" },
                      "& .MuiChip-label": { px: 0.5 },
                    }}
                  />
                </Tooltip>
              )}

              {/* Required badge */}
              {field.required && (
                <Chip
                  label="Required"
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    bgcolor: isDark
                      ? colorTokens.status.error.bgDark
                      : colorTokens.status.error.bg,
                    color: isDark
                      ? colorTokens.status.error.light
                      : colorTokens.status.error.dark,
                    border: `1px solid ${colorTokens.status.error.main}20`,
                    display: { xs: "none", sm: "flex" },
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
              )}
            </Stack>
          </Stack>
        </CardActionArea>

        {/* ─── Action Buttons ─────────────────────────────── */}
        <Stack
          className="action-buttons"
          direction="row"
          alignItems="center"
          spacing={0}
          onClick={stop}
          sx={{
            px: 0.75,
            borderLeft: `1px solid ${ext.border.light}`,
            opacity: { xs: 1, sm: 0.4 },
            transform: { xs: "translateX(0)", sm: "translateX(4px)" },
            transition: "all 0.2s ease",
          }}
        >
          {/* Settings */}
          <Tooltip title={t("fieldSettings")} arrow>
            <IconButton
              aria-label={t("fieldSettings")}
              onClick={() => onOpenSettings(field.id)}
              size="small"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                color: selected ? config.color : "text.secondary",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: isDark ? config.bgDark : config.bgLight,
                  color: config.color,
                  transform: "rotate(45deg)",
                },
              }}
            >
              <SettingsRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          {/* Duplicate */}
          <Tooltip title="Duplicate field" arrow>
            <IconButton
              aria-label="Duplicate field"
              onClick={() => onDuplicate(field.id)}
              size="small"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                color: "text.secondary",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(59, 130, 246, 0.15)"
                    : "rgba(59, 130, 246, 0.08)",
                  color: "#3B82F6",
                },
              }}
            >
              <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          {/* Delete */}
          <Tooltip title="Delete field" arrow>
            <IconButton
              aria-label="Delete field"
              onClick={() => onDelete(field.id)}
              size="small"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                color: "text.secondary",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? colorTokens.status.error.bgDark
                    : colorTokens.status.error.bg,
                  color: colorTokens.status.error.main,
                },
              }}
            >
              <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
});
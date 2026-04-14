import { useMemo } from "react";
import {
  Box,
  Drawer,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";
import ToggleOnRoundedIcon from "@mui/icons-material/ToggleOnRounded";

import { useFormBuilderStore } from "@/store/formBuilderStore";
import { useI18n } from "@/hooks/useI18n";
import { colorTokens, extendedPalette } from "@/theme/palette";

import { DrawerHeader } from "./field-editor/DrawerHeader";
import { BasicSettingsSection } from "./field-editor/BasicSettingsSection";
import { OptionsSection } from "./field-editor/OptionsSection";
import { VisibilitySection } from "./field-editor/VisibilitySection";
import { ValidationSection } from "./field-editor/ValidationSection";
import { SectionCard } from "./field-editor/SectionCard";
import { FormControlLabel, MenuItem, Switch, TextField } from "@mui/material";

import type { FormField } from "@/types/form";

// ─────────────────────────────────────────────────────────
// DEFAULT VALUE SECTION (inline, simple enough)
// ─────────────────────────────────────────────────────────
function DefaultValueSection({
  field,
  patch,
  t,
}: {
  field: FormField;
  patch: (p: Partial<FormField>) => void;
  t: any;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
      bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
    },
  };


  return (
    <SectionCard
      title="Default Value"
      icon={<DataObjectRoundedIcon />}
      iconColor={colorTokens.teal[isDark ? 400 : 500]}
      defaultExpanded={false}
    >
      {field.type === "checkbox" ? (
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={!!field.defaultValue}
              onChange={(e) => patch({ defaultValue: e.target.checked })}
            />
          }
          label={
            <Typography variant="body2" fontWeight={600}>
              Checked by default
            </Typography>
          }
        />
      ) : field.type === "number" ? (
        <TextField
          size="small"
          type="number"
          fullWidth
          placeholder="0"
          value={
            field.defaultValue === undefined || field.defaultValue === ""
              ? ""
              : field.defaultValue
          }
          onChange={(e) =>
            patch({
              defaultValue:
                e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          sx={inputSx}
        />
      ) : field.type === "select" || field.type === "radio" ? (
        <TextField
          size="small"
          select
          fullWidth
          value={String(field.defaultValue ?? "")}
          onChange={(e) => patch({ defaultValue: e.target.value })}
          sx={inputSx}
        >
          <MenuItem value="">
            <em>No default</em>
          </MenuItem>
          {(field.options ?? []).map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      ) : field.type === "date" ? (
        <TextField
          size="small"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={String(field.defaultValue ?? "")}
          onChange={(e) => patch({ defaultValue: e.target.value })}
          sx={inputSx}
        />
      ) : field.type !== "file" ? (
        <TextField
          size="small"
          fullWidth
          placeholder="Default value…"
          value={String(field.defaultValue ?? "")}
          onChange={(e) => patch({ defaultValue: e.target.value })}
          sx={inputSx}
        />
      ) : (
        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: "italic" }}>
          File fields don't support default values.
        </Typography>
      )}
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────
// EMPTY STATE PANEL
// ─────────────────────────────────────────────────────────
function EmptyPanel({ t }: { t: any }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        p: 4,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 1,
          border: `2px dashed ${ext.border.main}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "float 3s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-6px)" },
          },
        }}
      >
        <TuneRoundedIcon
          sx={{
            fontSize: 30,
            color: isDark ? colorTokens.ocean[400] : colorTokens.ocean[500],
            opacity: 0.4,
          }}
        />
      </Box>
      <Typography variant="subtitle2" fontWeight={700}>
        No Field Selected
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 220, lineHeight: 1.6 }}>
        {t("selectField")}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN DRAWER
// ─────────────────────────────────────────────────────────
export function FieldEditorDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const schema = useFormBuilderStore((s) => s.schema);
  const selectedFieldId = useFormBuilderStore((s) => s.selectedFieldId);
  const updateField = useFormBuilderStore((s) => s.updateField);

  const field = useMemo(
    () => schema.fields.find((f) => f.id === selectedFieldId) ?? null,
    [schema.fields, selectedFieldId]
  );

  const otherFields = useMemo(
    () => schema.fields.filter((f) => f.id !== field?.id),
    [schema.fields, field]
  );

  const patch = (p: Partial<FormField>) => {
    if (field) updateField(field.id, p);
  };

  const showOptions =
    field?.type === "select" || field?.type === "radio";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          bgcolor: isDark ? colorTokens.slate[900] : colorTokens.slate[50],
          backgroundImage: "none",
          borderLeft: `1px solid ${ext.border.light}`,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {!field ? (
        <>
          {/* Mini header even in empty state */}
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: `1px solid ${ext.border.light}`,
              background: isDark
                ? `linear-gradient(145deg, ${colorTokens.slate[900]}, ${colorTokens.slate[800]})`
                : `linear-gradient(145deg, #ffffff, ${colorTokens.slate[50]})`,
            }}
          >
            <Typography
              variant="subtitle1"
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
              Field Settings
            </Typography>
          </Box>
          <EmptyPanel t={t} />
        </>
      ) : (
        <>
          {/* Sticky header */}
          <DrawerHeader
            fieldLabel={field.label}
            fieldType={field.type}
            onClose={onClose}
          />

          {/* Scrollable sections */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              "&::-webkit-scrollbar": { width: "5px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "3px",
                bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              },
            }}
          >
            {/* 1. Basic Settings */}
            <BasicSettingsSection field={field} patch={patch} t={t} />

            {/* 2. Options (select / radio only) */}
            {showOptions && (
              <OptionsSection field={field} patch={patch} t={t} />
            )}

            {/* 3. Default Value */}
            <DefaultValueSection field={field} patch={patch} t={t} />

            {/* 4. Visibility */}
            <VisibilitySection
              field={field}
              otherFields={otherFields}
              patch={patch}
              t={t}
            />

            {/* 5. Validation */}
            <ValidationSection field={field} patch={patch} t={t} />

            {/* Bottom spacer */}
            <Box sx={{ height: 16 }} />
          </Box>

          {/* Footer: Field ID */}
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderTop: `1px solid ${ext.border.light}`,
              bgcolor: isDark ? "rgba(255,255,255,0.01)" : colorTokens.slate[50],
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem" }}>
              Field ID:
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.65rem",
                color: isDark ? colorTokens.ocean[400] : colorTokens.ocean[600],
                bgcolor: isDark ? colorTokens.ocean[400] + "10" : colorTokens.ocean[600] + "08",
                px: 0.75,
                py: 0.2,
                borderRadius: 1,
              }}
            >
              {field.id}
            </Typography>
          </Box>
        </>
      )}
    </Drawer>
  );
}
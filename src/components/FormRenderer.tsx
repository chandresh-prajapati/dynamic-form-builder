// src/components/FormRenderer.tsx
import { useEffect, useMemo, memo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import type { FormSchema } from "@/types/form";
import {
  buildDynamicZodSchema,
  defaultValuesFromFields,
} from "@/schemas/formSchema.zod";
import { isFieldVisible } from "@/utils/visibility";
import { useI18n } from "@/hooks/useI18n";
import { DynamicFormField } from "./form-fields/DynamicFormField";
import { colorTokens, extendedPalette } from "@/theme/palette";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
export interface FormRendererProps {
  schema: FormSchema;
  preview?: boolean;
  onPreviewSubmit?: () => void;
  onSubmitSuccess?: (data: Record<string, unknown>) => void;
  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────
// PROGRESS INDICATOR
// ─────────────────────────────────────────────────────────
interface FormProgressProps {
  total: number;
  filled: number;
  required: number;
  requiredFilled: number;
}

const FormProgress = memo(function FormProgress({
  total,
  filled,
  required,
  requiredFilled,
}: FormProgressProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;
  const allRequiredFilled = required === requiredFilled;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        borderRadius: 1,
        bgcolor: isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(76,110,245,0.02)",
        border: `1px solid ${ext.border.light}`,
      }}
    >
      {/* Circular indicator */}
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={44}
          thickness={4}
          sx={{
            color: ext.border.light,
            position: "absolute",
          }}
        />
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={44}
          thickness={4}
          sx={{
            color: allRequiredFilled
              ? colorTokens.status.success.main
              : colorTokens.ocean[isDark ? 400 : 600],
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
              transition: "stroke-dashoffset 0.5s ease",
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            fontWeight={800}
            sx={{
              fontSize: "0.65rem",
              color: allRequiredFilled
                ? colorTokens.status.success.main
                : "text.primary",
            }}
          >
            {percentage}%
          </Typography>
        </Box>
      </Box>

      {/* Text info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ fontSize: "0.75rem", color: "text.primary" }}
        >
          {filled} of {total} fields completed
        </Typography>
        <Stack direction="row" spacing={0.75} sx={{ mt: 0.3 }}>
          <Chip
            size="small"
            label={`${requiredFilled}/${required} required`}
            sx={{
              height: 18,
              fontSize: "0.6rem",
              fontWeight: 700,
              bgcolor: allRequiredFilled
                ? isDark
                  ? colorTokens.status.success.bgDark
                  : colorTokens.status.success.bg
                : isDark
                  ? colorTokens.status.error.bgDark
                  : colorTokens.status.error.bg,
              color: allRequiredFilled
                ? isDark
                  ? colorTokens.status.success.light
                  : colorTokens.status.success.dark
                : isDark
                  ? colorTokens.status.error.light
                  : colorTokens.status.error.dark,
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
});

// ─────────────────────────────────────────────────────────
// ERROR SUMMARY
// ─────────────────────────────────────────────────────────
interface ErrorSummaryProps {
  errors: Record<string, { message?: string }>;
  fields: FormSchema["fields"];
}

const ErrorSummary = memo(function ErrorSummary({
  errors,
  fields,
}: ErrorSummaryProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const errorEntries = Object.entries(errors);
  if (errorEntries.length === 0) return null;

  return (
    <Alert
      severity="error"
      icon={<ErrorOutlineRoundedIcon sx={{ fontSize: 20 }} />}
      sx={{
        mb: 2.5,
        borderRadius: 1,
        border: `1px solid ${colorTokens.status.error.main}25`,
        bgcolor: isDark
          ? colorTokens.status.error.bgDark
          : colorTokens.status.error.bg,
        "& .MuiAlert-message": { width: "100%" },
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
        Please fix {errorEntries.length} error
        {errorEntries.length > 1 ? "s" : ""} below
      </Typography>
      <Stack spacing={0.25}>
        {errorEntries.map(([key, val]) => {
          const fieldDef = fields.find((f) => f.id === key);
          return (
            <Typography
              key={key}
              variant="caption"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Box
                component="span"
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  bgcolor: colorTokens.status.error.main,
                  flexShrink: 0,
                }}
              />
              <strong>{fieldDef?.label ?? key}:</strong>{" "}
              {val.message ?? "Invalid value"}
            </Typography>
          );
        })}
      </Stack>
    </Alert>
  );
});

// ─────────────────────────────────────────────────────────
// FORM BODY (renders visible fields)
// ─────────────────────────────────────────────────────────
const FormBody = memo(function FormBody({
  schema,
  disabled,
}: {
  schema: FormSchema;
  disabled?: boolean;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;
  const values = useWatch() as Record<string, unknown>;

  const visibleFields = schema.fields.filter((field) =>
    isFieldVisible(field, values)
  );
  const hiddenCount = schema.fields.length - visibleFields.length;

  return (
    <Stack spacing={0}>
      {visibleFields.map((field, index) => (
        <Box key={field.id}>
          {/* Field wrapper with number */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              py: 2,
              px: { xs: 0, sm: 0.5 },
              borderRadius: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isDark
                  ? "rgba(255,255,255,0.015)"
                  : "rgba(76,110,245,0.015)",
              },
            }}
          >
            {/* Field Number */}
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1.5,
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(76,110,245,0.06)",
                border: `1px solid ${ext.border.light}`,
                flexShrink: 0,
                mt: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: isDark
                    ? colorTokens.ocean[400]
                    : colorTokens.ocean[600],
                }}
              >
                {index + 1}
              </Typography>
            </Box>

            {/* Field Component */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <DynamicFormField field={field} disabled={disabled} />
            </Box>
          </Box>

          {/* Divider between fields */}
          {index < visibleFields.length - 1 && (
            <Divider
              sx={{
                borderColor: ext.border.light,
                mx: { xs: 0, sm: 5 },
              }}
            />
          )}
        </Box>
      ))}

      {/* Hidden fields indicator */}
      {hiddenCount > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 1.5,
            mt: 1,
            borderRadius: 1,
            bgcolor: isDark
              ? "rgba(139, 92, 246, 0.06)"
              : "rgba(139, 92, 246, 0.04)",
            border: `1px dashed rgba(139, 92, 246, 0.2)`,
          }}
        >
          <VisibilityOffRoundedIcon
            sx={{ fontSize: 14, color: "#8B5CF6", opacity: 0.7 }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              color: "#8B5CF6",
              fontWeight: 600,
            }}
          >
            {hiddenCount} field{hiddenCount > 1 ? "s" : ""} hidden by
            conditions
          </Typography>
        </Box>
      )}
    </Stack>
  );
});

// ─────────────────────────────────────────────────────────
// FORM PROGRESS TRACKER (hook)
// ─────────────────────────────────────────────────────────
function useFormProgress(
  schema: FormSchema,
  values: Record<string, unknown>
) {
  const visibleFields = schema.fields.filter((f) =>
    isFieldVisible(f, values)
  );

  const total = visibleFields.length;

  const filled = visibleFields.filter((f) => {
    const val = values[f.id];
    if (val === undefined || val === null || val === "") return false;
    if (typeof val === "boolean") return true; // checkbox
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }).length;

  const requiredFields = visibleFields.filter((f) => f.required);
  const required = requiredFields.length;

  const requiredFilled = requiredFields.filter((f) => {
    const val = values[f.id];
    if (val === undefined || val === null || val === "") return false;
    if (typeof val === "boolean") return val;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }).length;

  return { total, filled, required, requiredFilled };
}

// ─────────────────────────────────────────────────────────
// SUCCESS STATE
// ─────────────────────────────────────────────────────────
interface SuccessStateProps {
  preview: boolean;
  onReset: () => void;
}

function SuccessState({ preview, onReset }: SuccessStateProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 1,
          mx: "auto",
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${colorTokens.status.success.main}, ${colorTokens.teal[400]})`,
          boxShadow: `0 8px 32px ${colorTokens.status.success.main}30`,
          animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          "@keyframes popIn": {
            "0%": { transform: "scale(0)", opacity: 0 },
            "100%": { transform: "scale(1)", opacity: 1 },
          },
        }}
      >
        <CheckCircleRoundedIcon sx={{ fontSize: 40, color: "#fff" }} />
      </Box>

      <Typography variant="h5" fontWeight={800} gutterBottom>
        {preview ? "Validation Passed! ✨" : "Form Submitted! 🎉"}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 320, mx: "auto", mb: 3, lineHeight: 1.6 }}
      >
        {preview
          ? "All fields passed validation. Your form is working correctly."
          : "Thank you for your submission. Your response has been recorded."}
      </Typography>

      <Button
        variant="outlined"
        startIcon={<RestartAltRoundedIcon />}
        onClick={onReset}
        sx={{
          borderRadius: 1,
          px: 3,
          py: 1,
          fontWeight: 600,
          borderWidth: "1.5px",
          "&:hover": { borderWidth: "1.5px" },
        }}
      >
        {preview ? "Test Again" : t("submit") + " Another"}
      </Button>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN: FormRenderer
// ─────────────────────────────────────────────────────────
export function FormRenderer({
  schema,
  preview,
  onPreviewSubmit,
  onSubmitSuccess,
  disabled,
}: FormRendererProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Form Setup ────────────────────────────────────────
  const zodSchema = useMemo(
    () => buildDynamicZodSchema(schema.fields),
    [schema.fields]
  );
  const defaults = useMemo(
    () => defaultValuesFromFields(schema.fields),
    [schema.fields]
  );

  const fieldsStructureKey = useMemo(
    () =>
      schema.fields
        .map(
          (f) =>
            `${f.id}:${f.type}:${f.required}:${JSON.stringify(f.defaultValue)}:${JSON.stringify(f.visibility)}:${JSON.stringify(f.validation)}:${JSON.stringify(f.options)}`
        )
        .join("|"),
    [schema.fields]
  );

  const methods = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: defaults,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit, clearErrors, formState } = methods;
  const values = useWatch({ control: methods.control }) as Record<
    string,
    unknown
  >;

  // ─── Effects ───────────────────────────────────────────
  useEffect(() => {
    reset(defaultValuesFromFields(schema.fields));
    setShowSuccess(false);
  }, [schema.id, fieldsStructureKey, reset]);

  useEffect(() => {
    for (const f of schema.fields) {
      if (!isFieldVisible(f, values)) {
        clearErrors(f.id);
      }
    }
  }, [values, schema.fields, clearErrors]);

  // ─── Progress ──────────────────────────────────────────
  const progress = useFormProgress(schema, values);

  // ─── Submit ────────────────────────────────────────────
  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 600));

    if (preview) {
      onPreviewSubmit?.();
    } else {
      onSubmitSuccess?.(data as Record<string, unknown>);
    }

    setIsSubmitting(false);
    setShowSuccess(true);
  });

  const handleReset = () => {
    reset(defaultValuesFromFields(schema.fields));
    setShowSuccess(false);
  };

  const errorEntries = formState.errors as Record<
    string,
    { message?: string }
  >;
  const hasErrors =
    formState.isSubmitted && Object.keys(errorEntries).length > 0;

  // ─── Empty State ───────────────────────────────────────
  if (schema.fields.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
          borderRadius: 1,
          border: `2px dashed ${ext.border.light}`,
          bgcolor: isDark
            ? "rgba(255,255,255,0.01)"
            : "rgba(76,110,245,0.01)",
        }}
      >
        <InfoOutlinedIcon
          sx={{
            fontSize: 48,
            color: "text.disabled",
            mb: 2,
          }}
        />
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          No Fields Yet
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 280, mx: "auto" }}
        >
          Add fields in the Builder tab to see the form preview here.
        </Typography>
      </Box>
    );
  }

  // ─── Success State ─────────────────────────────────────
  if (showSuccess) {
    return (
      <SuccessState preview={!!preview} onReset={handleReset} />
    );
  }

  // ─── Form ──────────────────────────────────────────────
  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={onSubmit}
        noValidate
        sx={{ position: "relative" }}
      >
        {/* Submit progress bar */}
        <Collapse in={isSubmitting}>
          <LinearProgress
            sx={{
              mb: 2,
              borderRadius: 1,
              bgcolor: ext.accent.primarySoft,
              "& .MuiLinearProgress-bar": {
                background: colorTokens.gradients.accent,
                borderRadius: 1,
              },
            }}
          />
        </Collapse>

        {/* Preview mode banner */}
        {preview && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              mb: 2.5,
              borderRadius: 1,
              bgcolor: isDark
                ? "rgba(245, 158, 11, 0.08)"
                : "rgba(245, 158, 11, 0.06)",
              border: `1px solid ${colorTokens.status.warning.main}20`,
            }}
          >
            <PreviewRoundedIcon
              sx={{
                fontSize: 16,
                color: isDark
                  ? colorTokens.status.warning.light
                  : colorTokens.status.warning.dark,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: isDark
                  ? colorTokens.status.warning.light
                  : colorTokens.status.warning.dark,
                fontSize: "0.75rem",
              }}
            >
              Preview Mode — Submissions won't be saved
            </Typography>
          </Box>
        )}

        {/* Description */}
        {schema.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2.5,
              lineHeight: 1.7,
              fontSize: "0.875rem",
            }}
          >
            {schema.description}
          </Typography>
        )}

        {/* Progress */}
        <Box sx={{ mb: 2.5 }}>
          <FormProgress {...progress} />
        </Box>

        {/* Error Summary */}
        <Collapse in={hasErrors}>
          <ErrorSummary errors={errorEntries} fields={schema.fields} />
        </Collapse>

        {/* Form Fields */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 1,
            border: `1px solid ${ext.border.light}`,
            bgcolor: isDark
              ? "rgba(255,255,255,0.01)"
              : "#ffffff",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <FormBody schema={schema} disabled={disabled || isSubmitting} />
          </Box>
        </Card>

        {/* Submit Section */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Reset Button */}
          <Button
            type="button"
            variant="text"
            onClick={handleReset}
            disabled={isSubmitting}
            startIcon={<RestartAltRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.8125rem",
              borderRadius: 1,
              px: 2,
              "&:hover": {
                bgcolor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
              },
            }}
          >
            Reset
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={disabled || isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : preview ? (
                <PreviewRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <SendRoundedIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: "0.875rem",
              background: isSubmitting
                ? undefined
                : preview
                  ? `linear-gradient(135deg, ${colorTokens.status.warning.main}, ${colorTokens.coral[500]})`
                  : colorTokens.gradients.accent,
              boxShadow: isSubmitting
                ? "none"
                : preview
                  ? `0 4px 16px ${colorTokens.status.warning.main}30`
                  : `0 4px 16px ${colorTokens.ocean[500]}30`,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: preview
                  ? `0 8px 24px ${colorTokens.status.warning.main}40`
                  : `0 8px 24px ${colorTokens.ocean[500]}40`,
              },
              "&:active": {
                transform: "translateY(0)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isSubmitting
              ? "Submitting…"
              : preview
                ? `${t("preview")}: ${t("submit")}`
                : t("submit")}
          </Button>
        </Box>

        {/* Required fields note */}
        {progress.required > 0 && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{
              display: "block",
              textAlign: "right",
              mt: 1.5,
              fontSize: "0.68rem",
            }}
          >
            * {progress.required} required field
            {progress.required > 1 ? "s" : ""}
          </Typography>
        )}
      </Box>
    </FormProvider>
  );
}
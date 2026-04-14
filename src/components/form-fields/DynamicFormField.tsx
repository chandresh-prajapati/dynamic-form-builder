// src/components/DynamicFormField.tsx
import { memo, useCallback, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import VideoFileRoundedIcon from "@mui/icons-material/VideoFileRounded";
import AudioFileRoundedIcon from "@mui/icons-material/AudioFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import type { FormField } from "@/types/form";
import { colorTokens, extendedPalette } from "@/theme/palette";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
export interface DynamicFormFieldProps {
  field: FormField;
  disabled?: boolean;
}

interface FilePreviewItem {
  file: File;
  previewUrl: string | null; // null = non-image
  id: string;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function toDayjs(value: unknown): Dayjs | null {
  if (value === null || value === undefined || value === "") return null;
  if (dayjs.isDayjs(value)) return value;
  const d = dayjs(String(value));
  return d.isValid() ? d : null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileCategory(file: File): "image" | "pdf" | "video" | "audio" | "doc" | "other" {
  const mime = file.type;
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (
    mime.includes("word") ||
    mime.includes("document") ||
    mime.includes("text/")
  )
    return "doc";
  return "other";
}

const FILE_ICON_MAP = {
  image: ImageRoundedIcon,
  pdf: PictureAsPdfRoundedIcon,
  video: VideoFileRoundedIcon,
  audio: AudioFileRoundedIcon,
  doc: DescriptionRoundedIcon,
  other: InsertDriveFileRoundedIcon,
} as const;

const FILE_COLOR_MAP = {
  image: "#10B981",
  pdf: "#F43F5E",
  video: "#8B5CF6",
  audio: "#F59E0B",
  doc: "#3B82F6",
  other: "#64748B",
} as const;

// ─────────────────────────────────────────────────────────────
// FILE PREVIEW COMPONENT
// ─────────────────────────────────────────────────────────────
interface FilePreviewCardProps {
  item: FilePreviewItem;
  onRemove: (id: string) => void;
  disabled: boolean;
}

function FilePreviewCard({ item, onRemove, disabled }: FilePreviewCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const category = getFileCategory(item.file);
  const IconComponent = FILE_ICON_MAP[category];
  const iconColor = FILE_COLOR_MAP[category];
  const isImage = category === "image" && item.previewUrl;

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 1.5,
        border: `1px solid ${ext.border.light}`,
        overflow: "hidden",
        bgcolor: isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.8)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: colorTokens.ocean[isDark ? 400 : 500],
          boxShadow: `0 4px 16px ${colorTokens.ocean[500]}15`,
        },
        "&:hover .remove-btn": {
          opacity: 1,
          transform: "scale(1)",
        },
      }}
    >
      {/* Image Preview */}
      {isImage ? (
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={item.previewUrl!}
            alt={item.file.name}
            sx={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Image Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.65) 100%)",
            }}
          />
          {/* Filename on image */}
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 6,
              left: 8,
              right: 36,
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.7rem",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.file.name}
          </Typography>
        </Box>
      ) : (
        /* Non-Image Preview */
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
          }}
        >
          {/* File Icon Box */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${iconColor}15`,
              border: `1px solid ${iconColor}25`,
              flexShrink: 0,
            }}
          >
            <IconComponent sx={{ fontSize: 22, color: iconColor }} />
          </Box>

          {/* File Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "text.primary",
                fontSize: "0.75rem",
              }}
            >
              {item.file.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.3 }}>
              <Chip
                label={category.toUpperCase()}
                size="small"
                sx={{
                  height: 16,
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  bgcolor: `${iconColor}15`,
                  color: iconColor,
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.68rem" }}
              >
                {formatBytes(item.file.size)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Success indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 6,
          left: 6,
          bgcolor: "#10B981",
          borderRadius: "50%",
          width: 18,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }}
      >
        <CheckCircleRoundedIcon sx={{ fontSize: 13, color: "#fff" }} />
      </Box>

      {/* Size chip for images (bottom right) */}
      {isImage && (
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            right: 36,
          }}
        >
          <Chip
            label={formatBytes(item.file.size)}
            size="small"
            sx={{
              height: 16,
              fontSize: "0.6rem",
              fontWeight: 600,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Box>
      )}

      {/* Remove Button */}
      {!disabled && (
        <Tooltip title="Remove file" arrow>
          <IconButton
            className="remove-btn"
            size="small"
            onClick={() => onRemove(item.id)}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 26,
              height: 26,
              bgcolor: isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              border: `1px solid ${ext.border.light}`,
              opacity: 0,
              transform: "scale(0.8)",
              transition: "all 0.2s ease",
              color: colorTokens.status.error.main,
              "&:hover": {
                bgcolor: colorTokens.status.error.main,
                borderColor: colorTokens.status.error.main,
                color: "#fff",
              },
            }}
          >
            <DeleteRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// DROP ZONE COMPONENT
// ─────────────────────────────────────────────────────────────
interface FileDropZoneProps {
  label: string;
  disabled: boolean;
  hasFiles: boolean;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.Ref<HTMLInputElement>;
}

function FileDropZone({
  label,
  disabled,
  hasFiles,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  inputProps,
  inputRef,
}: FileDropZoneProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  return (
    <Box
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      sx={{
        position: "relative",
        borderRadius: 1,
        border: `2px dashed`,
        borderColor: isDragOver
          ? colorTokens.ocean[isDark ? 400 : 500]
          : hasFiles
            ? colorTokens.status.success.main
            : ext.border.main,
        bgcolor: isDragOver
          ? ext.accent.primarySoft
          : hasFiles
            ? isDark
              ? colorTokens.status.success.bgDark
              : colorTokens.status.success.bg
            : isDark
              ? "rgba(255,255,255,0.02)"
              : "rgba(76,110,245,0.01)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isDragOver ? "scale(1.01)" : "scale(1)",
        cursor: disabled ? "not-allowed" : "pointer",
        overflow: "hidden",
      }}
    >
      {/* Animated background on drag */}
      {isDragOver && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at center, ${colorTokens.ocean[isDark ? 400 : 500]}10, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Upload Trigger Button */}
      <Button
        component="label"
        disabled={disabled}
        sx={{
          width: "100%",
          py: 3,
          px: 2,
          borderRadius: "inherit",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          textTransform: "none",
          color: "inherit",
          "&:hover": {
            bgcolor: "transparent",
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDragOver
              ? colorTokens.gradients.accent
              : hasFiles
                ? `linear-gradient(135deg, ${colorTokens.status.success.main}, ${colorTokens.teal[400]})`
                : isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(76,110,245,0.08)",
            transition: "all 0.3s ease",
            transform: isDragOver ? "translateY(-4px) scale(1.1)" : "none",
          }}
        >
          {hasFiles ? (
            <CheckCircleRoundedIcon
              sx={{
                fontSize: 26,
                color: isDragOver
                  ? "#fff"
                  : colorTokens.status.success.main,
              }}
            />
          ) : (
            <CloudUploadRoundedIcon
              sx={{
                fontSize: 26,
                color: isDragOver
                  ? "#fff"
                  : isDark
                    ? colorTokens.ocean[400]
                    : colorTokens.ocean[500],
              }}
            />
          )}
        </Box>

        {/* Text */}
        <Box textAlign="center">
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color={
              isDragOver
                ? isDark
                  ? colorTokens.ocean[300]
                  : colorTokens.ocean[700]
                : "text.primary"
            }
          >
            {isDragOver
              ? "Drop files here"
              : hasFiles
                ? "Add more files"
                : label}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.3 }}
          >
            {isDragOver
              ? "Release to upload"
              : "Drag & drop or click to browse"}
          </Typography>
        </Box>

        {/* Hidden input */}
        <input
          {...inputProps}
          ref={inputRef}
          type="file"
          hidden
          multiple
        />
      </Button>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// FILE FIELD (main component)
// ─────────────────────────────────────────────────────────────
interface FileFieldProps {
  field: FormField;
  disabled: boolean;
}

function FileField({ field, disabled }: FileFieldProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const err = errors[field.id]?.message as string | undefined;
  const [previews, setPreviews] = useState<FilePreviewItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Build preview items from File[]
  const buildPreviews = useCallback(
    (files: File[], onChangeFn: (files: FileList | File[]) => void) => {
      setIsProcessing(true);
      const items: FilePreviewItem[] = [];
      let processed = 0;

      if (files.length === 0) {
        setPreviews([]);
        setIsProcessing(false);
        return;
      }

      files.forEach((file) => {
        const id = `${file.name}-${file.size}-${file.lastModified}`;
        const isImage = file.type.startsWith("image/");

        if (isImage) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            items.push({
              file,
              previewUrl: ev.target?.result as string,
              id,
            });
            processed++;
            if (processed === files.length) {
              setPreviews(items);
              setIsProcessing(false);
            }
          };
          reader.readAsDataURL(file);
        } else {
          items.push({ file, previewUrl: null, id });
          processed++;
          if (processed === files.length) {
            setPreviews(items);
            setIsProcessing(false);
          }
        }
      });

      onChangeFn(files);
    },
    []
  );

  const handleRemove = useCallback(
    (id: string, onChangeFn: (files: File[]) => void) => {
      setPreviews((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        onChangeFn(updated.map((p) => p.file));
        return updated;
      });
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    <Controller
      name={field.id}
      control={control}
      render={({ field: f }) => {
        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragOver(false);
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) buildPreviews(files, f.onChange);
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) {
            const merged = [
              ...previews.map((p) => p.file),
              ...files,
            ];
            buildPreviews(merged, f.onChange);
          }
          e.target.value = "";
        };

        return (
          <FormControl fullWidth error={!!err} disabled={disabled}>
            {/* Field Label */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color={err ? "error.main" : "text.primary"}
              >
                {field.label}
              </Typography>
              {previews.length > 0 && (
                <Chip
                  label={`${previews.length} file${previews.length > 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    bgcolor: isDark
                      ? colorTokens.status.success.bgDark
                      : colorTokens.status.success.bg,
                    color: isDark
                      ? colorTokens.status.success.light
                      : colorTokens.status.success.dark,
                  }}
                />
              )}
            </Box>

            {/* Drop Zone */}
            <FileDropZone
              label={`Upload ${field.label}`}
              disabled={disabled}
              hasFiles={previews.length > 0}
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              inputRef={f.ref}
              inputProps={{
                name: f.name,
                onBlur: f.onBlur,
                onChange: handleInputChange,
              }}
            />

            {/* Processing Indicator */}
            {isProcessing && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  sx={{
                    borderRadius: 1,
                    bgcolor: ext.accent.primarySoft,
                    "& .MuiLinearProgress-bar": {
                      background: colorTokens.gradients.accent,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  Processing files…
                </Typography>
              </Box>
            )}

            {/* Preview Grid */}
            {previews.length > 0 && !isProcessing && (
              <Box
                sx={{
                  mt: 1.5,
                  // display: "grid",
                  // gridTemplateColumns: {
                  //   xs: "repeat(2, 1fr)",
                  //   sm: "repeat(3, 1fr)",
                  //   md: "repeat(4, 1fr)",
                  // },
                  gap: 1.5,
                }}
              >
                {previews.map((item) => (
                  <FilePreviewCard
                    key={item.id}
                    item={item}
                    disabled={disabled}
                    onRemove={(id) =>
                      handleRemove(id, f.onChange)
                    }
                  />
                ))}
              </Box>
            )}

            {/* Total size summary */}
            {previews.length > 1 && (
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Total:
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color={isDark ? colorTokens.ocean[300] : colorTokens.ocean[700]}
                >
                  {formatBytes(
                    previews.reduce((acc, p) => acc + p.file.size, 0)
                  )}
                </Typography>
              </Box>
            )}

            {/* Error */}
            {err && (
              <FormHelperText sx={{ mx: 0, mt: 0.75 }}>
                {err}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — DynamicFormField
// ─────────────────────────────────────────────────────────────
export const DynamicFormField = memo(function DynamicFormField({
  field,
  disabled = false,
}: DynamicFormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const err = errors[field.id]?.message as string | undefined;
  const errorProps = err
    ? { error: true as const, helperText: err }
    : {};

  switch (field.type) {
    // ── Text variants ──────────────────────────────────────
    case "text":
    case "email":
    case "password":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <TextField
              {...f}
              value={f.value ?? ""}
              fullWidth
              label={field.label}
              placeholder={field.placeholder}
              disabled={disabled}
              type={
                field.type === "password"
                  ? "password"
                  : field.type === "email"
                    ? "email"
                    : "text"
              }
              {...errorProps}
            />
          )}
        />
      );

    // ── Textarea ───────────────────────────────────────────
    case "textarea":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <TextField
              {...f}
              value={f.value ?? ""}
              fullWidth
              label={field.label}
              placeholder={field.placeholder}
              disabled={disabled}
              multiline
              minRows={3}
              {...errorProps}
            />
          )}
        />
      );

    // ── Number ─────────────────────────────────────────────
    case "number":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <TextField
              {...f}
              onChange={(e) => {
                const val = e.target.value;
                f.onChange(val === "" ? "" : Number(val));
              }}
              value={f.value ?? ""}
              fullWidth
              type="number"
              label={field.label}
              placeholder={field.placeholder}
              disabled={disabled}
              inputProps={{
                min: field.validation?.min,
                max: field.validation?.max,
              }}
              {...errorProps}
            />
          )}
        />
      );

    // ── Select ─────────────────────────────────────────────
    case "select":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <FormControl fullWidth disabled={disabled} error={!!err}>
              <InputLabel id={`${field.id}-label`}>
                {field.label}
              </InputLabel>
              <Select
                labelId={`${field.id}-label`}
                label={field.label}
                value={f.value ?? ""}
                onChange={f.onChange}
                onBlur={f.onBlur}
                name={f.name}
                inputRef={f.ref}
              >
                {(field.options ?? []).map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
              {err && <FormHelperText>{err}</FormHelperText>}
            </FormControl>
          )}
        />
      );

    // ── Radio ──────────────────────────────────────────────
    case "radio":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <FormControl
              component="fieldset"
              error={!!err}
              disabled={disabled}
            >
              <InputLabel
                component="legend"
                sx={{ position: "static", transform: "none", mb: 1 }}
              >
                {field.label}
              </InputLabel>
              <RadioGroup {...f} value={f.value ?? ""}>
                {(field.options ?? []).map((o) => (
                  <FormControlLabel
                    key={o.value}
                    value={o.value}
                    control={<Radio />}
                    label={o.label}
                  />
                ))}
              </RadioGroup>
              {err && <FormHelperText>{err}</FormHelperText>}
            </FormControl>
          )}
        />
      );

    // ── Checkbox ───────────────────────────────────────────
    case "checkbox":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <FormControl error={!!err} disabled={disabled}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!f.value}
                    onChange={(e) => f.onChange(e.target.checked)}
                    name={f.name}
                  />
                }
                label={field.label}
              />
              {err && <FormHelperText>{err}</FormHelperText>}
            </FormControl>
          )}
        />
      );

    // ── Date ───────────────────────────────────────────────
    case "date":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <DatePicker
              label={field.label}
              disabled={disabled}
              value={toDayjs(f.value)}
              onChange={(d) =>
                f.onChange(d ? d.format("YYYY-MM-DD") : "")
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  ...errorProps,
                },
              }}
            />
          )}
        />
      );

    // ── File (enhanced with preview) ───────────────────────
    case "file":
      return <FileField field={field} disabled={disabled} />;

    default:
      return null;
  }
});
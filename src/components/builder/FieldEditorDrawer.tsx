import { useMemo } from "react";
import {
  Box,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type { FieldType, FormField, VisibilityOperator } from "@/types/form";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { useI18n } from "@/hooks/useI18n";

const FIELD_TYPES: FieldType[] = [
  "text",
  "number",
  "email",
  "password",
  "select",
  "radio",
  "checkbox",
  "date",
  "file",
  "textarea",
];

const OPS: VisibilityOperator[] = ["equals", "notEquals", "isEmpty", "isNotEmpty"];

export function FieldEditorDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const schema = useFormBuilderStore((s) => s.schema);
  const selectedFieldId = useFormBuilderStore((s) => s.selectedFieldId);
  const updateField = useFormBuilderStore((s) => s.updateField);

  const field = useMemo(
    () => schema.fields.find((f) => f.id === selectedFieldId) ?? null,
    [schema.fields, selectedFieldId]
  );

  if (!field) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 360 } }}>
        <Box sx={{ p: 2 }}>
          <Typography color="text.secondary">{t("selectField")}</Typography>
        </Box>
      </Drawer>
    );
  }

  const otherFields = schema.fields.filter((f) => f.id !== field.id);

  const patch = (p: Partial<FormField>) => updateField(field.id, p);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 380 } }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t("fieldSettings")}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={t("label")}
            fullWidth
            value={field.label}
            onChange={(e) => patch({ label: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel id="ft">Type</InputLabel>
            <Select
              labelId="ft"
              label="Type"
              value={field.type}
              onChange={(e) => patch({ type: e.target.value as FieldType })}
            >
              {FIELD_TYPES.map((ft) => (
                <MenuItem key={ft} value={ft}>
                  {ft}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {field.type !== "checkbox" && field.type !== "radio" && field.type !== "file" ? (
            <TextField
              label={t("placeholder")}
              fullWidth
              value={field.placeholder ?? ""}
              onChange={(e) => patch({ placeholder: e.target.value })}
            />
          ) : null}
          <FormControlLabel
            control={
              <Switch checked={field.required} onChange={(e) => patch({ required: e.target.checked })} />
            }
            label={t("required")}
          />

          <Divider />

          <Typography variant="subtitle2">{t("defaultValue")}</Typography>
          {field.type === "checkbox" ? (
            <FormControlLabel
              control={
                <Switch
                  checked={!!field.defaultValue}
                  onChange={(e) => patch({ defaultValue: e.target.checked })}
                />
              }
              label={t("defaultValue")}
            />
          ) : field.type === "number" ? (
            <TextField
              type="number"
              fullWidth
              value={field.defaultValue === undefined || field.defaultValue === "" ? "" : field.defaultValue}
              onChange={(e) =>
                patch({
                  defaultValue: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          ) : field.type === "select" || field.type === "radio" ? (
            <TextField
              select
              fullWidth
              value={String(field.defaultValue ?? "")}
              onChange={(e) => patch({ defaultValue: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {(field.options ?? []).map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          ) : field.type === "date" ? (
            <TextField
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={String(field.defaultValue ?? "")}
              onChange={(e) => patch({ defaultValue: e.target.value })}
            />
          ) : field.type !== "file" ? (
            <TextField
              fullWidth
              value={String(field.defaultValue ?? "")}
              onChange={(e) => patch({ defaultValue: e.target.value })}
            />
          ) : null}

          {(field.type === "select" || field.type === "radio") && (
            <TextField
              label={t("options")}
              fullWidth
              multiline
              minRows={4}
              value={(field.options ?? []).map((o) => `${o.label}=${o.value}`).join("\n")}
              onChange={(e) => {
                const lines = e.target.value.split("\n");
                const options = lines
                  .map((line) => {
                    const [l, ...rest] = line.split("=");
                    const v = rest.join("=").trim();
                    return { label: l?.trim() || v || "option", value: v || l?.trim() || "option" };
                  })
                  .filter((o) => o.label || o.value);
                patch({ options: options.length ? options : [{ label: "A", value: "a" }] });
              }}
              helperText="One option per line: Label=value"
            />
          )}

          <Divider />
          <Typography variant="subtitle2">{t("conditional")}</Typography>
          <FormControl fullWidth>
            <InputLabel>{t("dependsOn")}</InputLabel>
            <Select
              label={t("dependsOn")}
              value={field.visibility?.dependsOnFieldId ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                patch({
                  visibility: id
                    ? {
                        dependsOnFieldId: id,
                        operator: field.visibility?.operator ?? "equals",
                        value: field.visibility?.value,
                      }
                    : undefined,
                });
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {otherFields.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.label} ({f.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {field.visibility ? (
            <>
              <FormControl fullWidth>
                <InputLabel>{t("operator")}</InputLabel>
                <Select
                  label={t("operator")}
                  value={field.visibility.operator}
                  onChange={(e) =>
                    patch({
                      visibility: {
                        ...field.visibility!,
                        operator: e.target.value as VisibilityOperator,
                      },
                    })
                  }
                >
                  {OPS.map((op) => (
                    <MenuItem key={op} value={op}>
                      {op}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {field.visibility.operator === "equals" || field.visibility.operator === "notEquals" ? (
                <TextField
                  label={t("compareValue")}
                  fullWidth
                  value={field.visibility.value ?? ""}
                  onChange={(e) =>
                    patch({
                      visibility: { ...field.visibility!, value: e.target.value },
                    })
                  }
                />
              ) : null}
            </>
          ) : null}

          <Divider />
          <Typography variant="subtitle2">Validation</Typography>
          {(field.type === "text" ||
            field.type === "textarea" ||
            field.type === "password" ||
            field.type === "email") && (
            <>
              <TextField
                label={t("minLength")}
                type="number"
                fullWidth
                value={field.validation?.minLength ?? ""}
                onChange={(e) =>
                  patch({
                    validation: {
                      ...field.validation,
                      minLength: e.target.value === "" ? undefined : Number(e.target.value),
                    },
                  })
                }
              />
              <TextField
                label={t("maxLength")}
                type="number"
                fullWidth
                value={field.validation?.maxLength ?? ""}
                onChange={(e) =>
                  patch({
                    validation: {
                      ...field.validation,
                      maxLength: e.target.value === "" ? undefined : Number(e.target.value),
                    },
                  })
                }
              />
            </>
          )}
          {field.type === "number" && (
            <>
              <TextField
                label={t("min")}
                type="number"
                fullWidth
                value={field.validation?.min ?? ""}
                onChange={(e) =>
                  patch({
                    validation: {
                      ...field.validation,
                      min: e.target.value === "" ? undefined : Number(e.target.value),
                    },
                  })
                }
              />
              <TextField
                label={t("max")}
                type="number"
                fullWidth
                value={field.validation?.max ?? ""}
                onChange={(e) =>
                  patch({
                    validation: {
                      ...field.validation,
                      max: e.target.value === "" ? undefined : Number(e.target.value),
                    },
                  })
                }
              />
            </>
          )}
          {(field.type === "text" || field.type === "textarea") && (
            <TextField
              label={t("pattern")}
              fullWidth
              value={field.validation?.pattern ?? ""}
              onChange={(e) =>
                patch({
                  validation: { ...field.validation, pattern: e.target.value || undefined },
                })
              }
            />
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}

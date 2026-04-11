import { memo } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import type { FormField } from "@/types/form";

export interface DynamicFormFieldProps {
  field: FormField;
  disabled?: boolean;
}

function toDayjs(value: unknown): Dayjs | null {
  if (value === null || value === undefined || value === "") return null;
  if (dayjs.isDayjs(value)) return value;
  const d = dayjs(String(value));
  return d.isValid() ? d : null;
}

export const DynamicFormField = memo(function DynamicFormField({
  field,
  disabled = false,
}: DynamicFormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const err = errors[field.id]?.message as string | undefined;
  const errorProps = err ? { error: true as const, helperText: err } : {};

  switch (field.type) {
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
                field.type === "password" ? "password" : field.type === "email" ? "email" : "text"
              }
              {...errorProps}
            />
          )}
        />
      );
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
    case "select":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <FormControl fullWidth disabled={disabled} error={!!err}>
              <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
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
    case "radio":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <FormControl component="fieldset" error={!!err} disabled={disabled}>
              <InputLabel component="legend" sx={{ position: "static", transform: "none", mb: 1 }}>
                {field.label}
              </InputLabel>
              <RadioGroup {...f} value={f.value ?? ""}>
                {(field.options ?? []).map((o) => (
                  <FormControlLabel key={o.value} value={o.value} control={<Radio />} label={o.label} />
                ))}
              </RadioGroup>
              {err && <FormHelperText>{err}</FormHelperText>}
            </FormControl>
          )}
        />
      );
    case "checkbox":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <FormControl error={!!err} disabled={disabled}>
              <FormControlLabel
                control={
                  <Checkbox checked={!!f.value} onChange={(e) => f.onChange(e.target.checked)} name={f.name} />
                }
                label={field.label}
              />
              {err && <FormHelperText>{err}</FormHelperText>}
            </FormControl>
          )}
        />
      );
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
              onChange={(d) => f.onChange(d ? d.format("YYYY-MM-DD") : "")}
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
    case "file":
      return (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <FormControl fullWidth error={!!err} disabled={disabled}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {field.label}
              </Typography>
              <Button variant="outlined" component="label" sx={{ alignSelf: "flex-start" }}>
                Choose file
                <input
                  type="file"
                  hidden
                  name={f.name}
                  ref={f.ref}
                  onBlur={f.onBlur}
                  onChange={(e) => f.onChange(e.target.files)}
                />
              </Button>
              {err && <FormHelperText>{err}</FormHelperText>}
            </FormControl>
          )}
        />
      );
    default:
      return null;
  }
});

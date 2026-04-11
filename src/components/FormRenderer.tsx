import { useEffect, useMemo, memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import type { FormSchema } from "@/types/form";
import { buildDynamicZodSchema, defaultValuesFromFields } from "@/schemas/formSchema.zod";
import { isFieldVisible } from "@/utils/visibility";
import { useI18n } from "@/hooks/useI18n";
import { DynamicFormField } from "./form-fields/DynamicFormField";

export interface FormRendererProps {
  schema: FormSchema;
  /** When true, submit shows preview-only behavior via onPreviewSubmit */
  preview?: boolean;
  onPreviewSubmit?: () => void;
  onSubmitSuccess?: (data: Record<string, unknown>) => void;
  disabled?: boolean;
}

const FormBody = memo(function FormBody({
  schema,
  disabled,
}: {
  schema: FormSchema;
  disabled?: boolean;
}) {
  const values = useWatch() as Record<string, unknown>;

  return (
    <Stack spacing={2}>
      {schema.fields.map((field) => {
        if (!isFieldVisible(field, values)) return null;
        return <DynamicFormField key={field.id} field={field} disabled={disabled} />;
      })}
    </Stack>
  );
});

export function FormRenderer({
  schema,
  preview,
  onPreviewSubmit,
  onSubmitSuccess,
  disabled,
}: FormRendererProps) {
  const { t } = useI18n();
  const zodSchema = useMemo(() => buildDynamicZodSchema(schema.fields), [schema.fields]);
  const defaults = useMemo(() => defaultValuesFromFields(schema.fields), [schema.fields]);
  /** Reset form only when structure changes, not when `defaults` gets a new object reference. */
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
  const values = useWatch({ control: methods.control }) as Record<string, any>;
  console.log("values",values);
  
  useEffect(() => {
    reset(defaultValuesFromFields(schema.fields));
    /* fieldsStructureKey captures real schema shape changes; omit schema.fields ref so label-only updates do not wipe preview input. */
  }, [schema.id, fieldsStructureKey, reset]); // eslint-disable-line react-hooks/exhaustive-deps -- schema.fields: intentional

  /** Clear errors for fields that are hidden so they do not keep the form invalid. */
  useEffect(() => {
    for (const f of schema.fields) {
      if (!isFieldVisible(f, values)) {
        clearErrors(f.id);
      }
    }
  }, [values, schema.fields, clearErrors]);

  const onSubmit = handleSubmit((data) => {
    if (preview) {
      onPreviewSubmit?.();
      return;
    }
    console.log("data", data);
    onSubmitSuccess?.(data as Record<string, unknown>);
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={onSubmit} noValidate>
        {schema.description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {schema.description}
          </Typography>
        ) : null}
        <FormBody schema={schema} disabled={disabled} />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" disabled={disabled || formState.isSubmitting}>
            {preview ? `${t("preview")}: ${t("submit")}` : t("submit")}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}

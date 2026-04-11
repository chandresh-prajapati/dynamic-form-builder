import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormSchema } from "@/types/form";
import {
  fetchFormSchema,
  listAllFormSchemas,
  listSubmissionsForForm,
  saveFormSchema,
  submitFormData,
  deleteFormSchema,
} from "@/services/formApi";

export const formKeys = {
  schema: (id: string) => ["form-schema", id] as const,
  responses: (id: string) => ["form-responses", id] as const,
  allForms: ["all-forms"] as const,
};

export function useFormSchemaQuery(formId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: formKeys.schema(formId ?? ""),
    queryFn: () => fetchFormSchema(formId!),
    enabled: !!formId && enabled,
  });
}

export function useSaveFormSchemaMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (schema: FormSchema) => saveFormSchema(schema),
    onSuccess: (saved) => {
      qc.setQueryData(formKeys.schema(saved.id), saved);
      qc.invalidateQueries({ queryKey: formKeys.allForms });
    },
  });
}

export function useDeleteFormMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formId: string) => deleteFormSchema(formId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formKeys.allForms });
    },
  });
}

export function useSubmitFormMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ formId, data }: { formId: string; data: Record<string, unknown> }) =>
      submitFormData(formId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: formKeys.responses(vars.formId) });
    },
  });
}

export function useFormResponsesQuery(formId: string | undefined) {
  return useQuery({
    queryKey: formKeys.responses(formId ?? ""),
    queryFn: () => listSubmissionsForForm(formId!),
    enabled: !!formId,
  });
}

export function useAllFormsQuery(enabled = true) {
  return useQuery({
    queryKey: formKeys.allForms,
    queryFn: listAllFormSchemas,
    enabled,
  });
}

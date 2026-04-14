import { z } from "zod";
import type { FormField, FormSchema } from "@/types/form";
import { isFieldVisible } from "@/utils/visibility";

export const fieldTypeSchema = z.enum([
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
]);

const validationSchema = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
  })
  .optional();

export const formFieldSchema = z.object({
  id: z.string().min(1),
  type: fieldTypeSchema,
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean(),
  defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  validation: validationSchema,
  visibility: z
    .object({
      dependsOnFieldId: z.string().min(1),
      operator: z.enum(["equals", "notEquals", "isEmpty", "isNotEmpty"]),
      value: z.string().optional(),
    })
    .optional(),
});

export const formSchemaZod = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export function parseFormSchemaJson(data: unknown): FormSchema {
  return formSchemaZod.parse(data) as FormSchema;
}

/**
 * Validates only fields that are visible for the current values (conditional logic).
 * Each key accepts any input; `superRefine` applies per-field Zod rules when visible.
 */
export function buildDynamicZodSchema(fields: FormField[]): z.ZodType<Record<string, unknown>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    shape[f.id] = z.any();
  }
  return z
    .object(shape)
    .superRefine((data, ctx) => {
      for (const f of fields) {
        if (!isFieldVisible(f, data as Record<string, unknown>)) continue;
        const schema = zodForField(f);
        const res = schema.safeParse(data[f.id]);
        if (!res.success) {
          /**
           * One flat issue per field with path [fieldId] only. Spreading inner Zod issues
           * produced paths like [fieldId, "min"], so RHF stored nested errors without
           * `errors[fieldId].message` — the UI looked fine after typing but submit stayed invalid.
           */
          const message = res.error.issues.map((i) => i.message).join(" ");
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [f.id],
            message,
          });
        }
      }
    });
}

function zodForField(f: FormField): z.ZodTypeAny {
  const v = f.validation ?? {};
  const required = f.required;

  switch (f.type) {
    case "number": {
      let inner = z.number({ invalid_type_error: "Must be a number" });
      if (v.min !== undefined) inner = inner.min(v.min);
      if (v.max !== undefined) inner = inner.max(v.max);
      const optionalNum = z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : val),
        inner.optional()
      );
      const requiredNum = z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? NaN : val),
        inner.refine((n) => !Number.isNaN(n), { message: "Required" })
      );
      return required ? requiredNum : optionalNum;
    }
    case "checkbox": {
      const b = z.boolean();
      return required ? b.refine((x) => x === true, { message: "Must be checked" }) : b.optional();
    }
    case "email": {
      if (required) {
        let s = z.string().min(1, "Required").email("Invalid email");
        if (v.minLength !== undefined) s = s.min(v.minLength);
        if (v.maxLength !== undefined) s = s.max(v.maxLength);
        return s;
      }
      return z.union([z.literal(""), z.string().email("Invalid email")]);
    }
    case "file": {
      if (required) {
        return z.any().refine((fl) => {
          if (typeof FileList !== "undefined" && fl instanceof FileList) return fl.length > 0;
          if (Array.isArray(fl)) return fl.length > 0;
          return false;
        }, "File required");
      }
      return z.any().optional();
    }
    default: {
      let s = z.string();
      if (v.minLength !== undefined) s = s.min(v.minLength);
      if (v.maxLength !== undefined) s = s.max(v.maxLength);
      if (v.pattern) {
        try {
          s = s.regex(new RegExp(v.pattern), "Invalid format");
        } catch {
          /* ignore invalid regex from builder */
        }
      }
      return required ? s.min(1, "Required") : z.union([z.literal(""), s]).optional();
    }
  }
}

export function defaultValuesFromFields(fields: FormField[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) {
      out[f.id] = f.defaultValue;
      continue;
    }
    switch (f.type) {
      case "checkbox":
        out[f.id] = false;
        break;
      case "number":
        out[f.id] = undefined;
        break;
      case "file":
        out[f.id] = undefined;
        break;
      default:
        out[f.id] = "";
    }
  }
  return out;
}

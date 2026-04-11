/**
 * Central form domain types. The JSON schema the builder produces is `FormSchema`;
 * individual inputs are `FormField` with a discriminated `type` for renderer logic.
 */
export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file"
  | "textarea";

export type VisibilityOperator = "equals" | "notEquals" | "isEmpty" | "isNotEmpty";

export interface FieldVisibility {
  dependsOnFieldId: string;
  operator: VisibilityOperator;
  /** Compared as string when operator needs a value */
  value?: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  /** Serialized defaults; file fields use empty string in schema */
  defaultValue?: string | number | boolean | string[];
  options?: SelectOption[];
  validation?: FieldValidation;
  visibility?: FieldVisibility;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export type FormSubmissionPayload = Record<string, unknown>;

export interface FormSubmissionRecord {
  id: string;
  formId: string;
  submittedAt: string;
  data: FormSubmissionPayload;
}

export type UserRole = "admin" | "user";

export type AppLocale = "en" | "es";

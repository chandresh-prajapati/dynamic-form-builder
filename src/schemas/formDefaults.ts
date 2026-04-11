import type { FieldType, FormField, FormSchema } from "@/types/form";

export function generateFieldId(): string {
  return crypto.randomUUID();
}

export function createEmptySchema(): FormSchema {
  const now = new Date().toISOString();
  return {
    id: generateFieldId(),
    title: "Untitled form",
    description: "",
    fields: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function defaultFieldForType(type: FieldType): Omit<FormField, "id"> {
  const base = {
    label: labelForType(type),
    placeholder: "",
    required: false,
    validation: {} as FormField["validation"],
  };

  switch (type) {
    case "select":
    case "radio":
      return {
        ...base,
        type,
        defaultValue: "",
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ],
      };
    case "checkbox":
      return { ...base, type, defaultValue: false };
    case "number":
      return { ...base, type, defaultValue: "" };
    case "date":
      return { ...base, type, defaultValue: "" };
    case "file":
      return { ...base, type, defaultValue: "" };
    default:
      return { ...base, type, defaultValue: "" };
  }
}

function labelForType(type: FieldType): string {
  const map: Record<FieldType, string> = {
    text: "Text",
    number: "Number",
    email: "Email",
    password: "Password",
    select: "Select",
    radio: "Radio",
    checkbox: "Checkbox",
    date: "Date",
    file: "File upload",
    textarea: "Long text",
  };
  return map[type];
}

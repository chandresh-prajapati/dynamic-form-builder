import type { FormField } from "@/types/form";

export function isFieldVisible(field: FormField, values: Record<string, unknown>): boolean {
  const vis = field.visibility;
  if (!vis) return true;

  const raw = values[vis.dependsOnFieldId];
  const str =
    raw === undefined || raw === null
      ? ""
      : typeof raw === "boolean"
        ? String(raw)
        : Array.isArray(raw)
          ? raw.join(",")
          : String(raw);

  switch (vis.operator) {
    case "equals":
      return str === (vis.value ?? "");
    case "notEquals":
      return str !== (vis.value ?? "");
    case "isEmpty":
      return str === "";
    case "isNotEmpty":
      return str !== "";
    default:
      return true;
  }
}

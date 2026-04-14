import type { FormSchema, FormSubmissionRecord } from "@/types/form";
import { api } from "./api";

const LS_FORMS = "mock-api-forms";
const LS_RESPONSES = "mock-api-responses";

function readForms(): Record<string, FormSchema> {
  try {
    const raw = localStorage.getItem(LS_FORMS);
    return raw ? (JSON.parse(raw) as Record<string, FormSchema>) : {};
  } catch {
    return {};
  }
}

function writeForms(map: Record<string, FormSchema>) {
  localStorage.setItem(LS_FORMS, JSON.stringify(map));
}

function readResponses(): FormSubmissionRecord[] {
  try {
    const raw = localStorage.getItem(LS_RESPONSES);
    return raw ? (JSON.parse(raw) as FormSubmissionRecord[]) : [];
  } catch {
    return [];
  }
}

function writeResponses(list: FormSubmissionRecord[]) {
  localStorage.setItem(LS_RESPONSES, JSON.stringify(list));
}

/** Simulated network latency for realistic React Query behavior */
function delay(ms = 280) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchFormSchema(formId: string): Promise<FormSchema> {
  await delay();
  const map = readForms();
  const schema = map[formId];
  if (!schema) {
    const err = new Error("Form not found");
    (err as Error & { status?: number }).status = 404;
    throw err;
  }
  return schema;
}

export async function saveFormSchema(schema: FormSchema): Promise<FormSchema> {
  await delay();
  const map = readForms();
  const updated: FormSchema = { ...schema, updatedAt: new Date().toISOString() };
  map[schema.id] = updated;
  writeForms(map);
  return updated;
}

export async function deleteFormSchema(formId: string): Promise<void> {
  await delay();
  const map = readForms();
  delete map[formId];
  writeForms(map);
  const responses = readResponses();
  const filtered = responses.filter((r) => r.formId !== formId);
  writeResponses(filtered);
}

export async function submitFormData(
  formId: string,
  data: Record<string, unknown>
): Promise<FormSubmissionRecord> {
  await delay();
  const serializedData = await serializePayload(data);
  const record: FormSubmissionRecord = {
    id: crypto.randomUUID(),
    formId,
    submittedAt: new Date().toISOString(),
    data: serializedData,
  };
  const list = readResponses();
  list.unshift(record);
  writeResponses(list);
  return record;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

async function serializePayload(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v instanceof FileList || (Array.isArray(v) && v.length > 0 && v[0] instanceof File)) {
      const files = Array.from(v as Iterable<File>);
      const serialized = await Promise.all(
        files.map(async (f) => {
          let previewUrl: string | undefined = undefined;
          if (f.type.startsWith("image/")) {
            previewUrl = await fileToBase64(f);
          }
          return { name: f.name, size: f.size, type: f.type, previewUrl };
        })
      );
      out[k] = serialized;
    } else {
      out[k] = v;
    }
  }
  return out;
}

export async function listSubmissionsForForm(formId: string): Promise<FormSubmissionRecord[]> {
  await delay(120);
  return readResponses().filter((r) => r.formId === formId);
}

/** For user dashboard: all schemas stored in the mock backend */
export async function listAllFormSchemas(): Promise<FormSchema[]> {
  await delay(120);
  return Object.values(readForms());
}

/** Optional: seed axios-shaped calls if you swap to HTTP later */
export async function fetchFormSchemaHttp(formId: string) {
  return api.get<FormSchema>(`/forms/${formId}`).then((r) => r.data);
}

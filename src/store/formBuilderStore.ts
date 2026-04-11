import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FormField, FormSchema } from "@/types/form";
import { createEmptySchema, generateFieldId } from "@/schemas/formDefaults";

export interface FormBuilderState {
  schema: FormSchema;
  selectedFieldId: string | null;
  setSchema: (schema: FormSchema) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  selectField: (id: string | null) => void;
  addField: (field: Omit<FormField, "id">) => void;
  updateField: (id: string, patch: Partial<FormField>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (activeId: string, overId: string) => void;
  replaceFields: (fields: FormField[]) => void;
  loadFromRemote: (schema: FormSchema) => void;
}

function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...list];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      schema: createEmptySchema(),
      selectedFieldId: null,

      setSchema: (schema) => set({ schema, selectedFieldId: null }),

      setTitle: (title) =>
        set((s) => ({
          schema: { ...s.schema, title, updatedAt: new Date().toISOString() },
        })),

      setDescription: (description) =>
        set((s) => ({
          schema: { ...s.schema, description, updatedAt: new Date().toISOString() },
        })),

      selectField: (selectedFieldId) => set({ selectedFieldId }),

      addField: (field) =>
        set((s) => ({
          schema: {
            ...s.schema,
            fields: [...s.schema.fields, { ...field, id: generateFieldId() }],
            updatedAt: new Date().toISOString(),
          },
          selectedFieldId: null,
        })),

      updateField: (id, patch) =>
        set((s) => ({
          schema: {
            ...s.schema,
            fields: s.schema.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
            updatedAt: new Date().toISOString(),
          },
        })),

      removeField: (id) =>
        set((s) => ({
          schema: {
            ...s.schema,
            fields: s.schema.fields.filter((f) => f.id !== id),
            updatedAt: new Date().toISOString(),
          },
          selectedFieldId: s.selectedFieldId === id ? null : s.selectedFieldId,
        })),

      duplicateField: (id) => {
        const f = get().schema.fields.find((x) => x.id === id);
        if (!f) return;
        const copy: FormField = {
          ...f,
          id: generateFieldId(),
          label: `${f.label} (copy)`,
        };
        const idx = get().schema.fields.findIndex((x) => x.id === id);
        const fields = [...get().schema.fields];
        fields.splice(idx + 1, 0, copy);
        set({
          schema: { ...get().schema, fields, updatedAt: new Date().toISOString() },
          selectedFieldId: copy.id,
        });
      },

      reorderFields: (activeId, overId) => {
        const { fields } = get().schema;
        const oldIndex = fields.findIndex((f) => f.id === activeId);
        const newIndex = fields.findIndex((f) => f.id === overId);
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;
        set({
          schema: {
            ...get().schema,
            fields: reorder(fields, oldIndex, newIndex),
            updatedAt: new Date().toISOString(),
          },
        });
      },

      replaceFields: (fields) =>
        set((s) => ({
          schema: { ...s.schema, fields, updatedAt: new Date().toISOString() },
        })),

      loadFromRemote: (schema) => set({ schema, selectedFieldId: null }),
    }),
    {
      name: "form-builder-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ schema: s.schema }),
    }
  )
);

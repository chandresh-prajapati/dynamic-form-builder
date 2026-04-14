// src/pages/DashboardPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { DashboardHeader } from "@/components/builder/DashboardHeader";
import { FieldEditorDrawer } from "@/components/builder/FieldEditorDrawer";
import { ConfirmDeleteDialog } from "@/components/builder/ConfirmDeleteDialog";
import { useSaveFormSchemaMutation, useFormResponsesQuery } from "@/hooks/useFormApi";
import { parseFormSchemaJson } from "@/schemas/formSchema.zod";
import { generateFieldId, createEmptySchema } from "@/schemas/formDefaults";
import { useI18n } from "@/hooks/useI18n";
import { DashboardTabs } from "@/components/builder/DashboardTabs";
import { AppSnackbar } from "@/components/common/AppSnackbar";
import { BuilderTab } from "@/components/builder/BuilderTab";
import { ResponsesTab } from "@/components/builder/ResponsesTab";
import { PreviewTab } from "@/components/builder/PreviewTab";

type TabKey = "builder" | "preview" | "responses";

export function DashboardPage() {
  const { t } = useI18n();

  // ─── Store ───────────────────────────────────────────
  const schema      = useFormBuilderStore((s) => s.schema);
  const setTitle    = useFormBuilderStore((s) => s.setTitle);
  const setDescription = useFormBuilderStore((s) => s.setDescription);
  const setSchema   = useFormBuilderStore((s) => s.setSchema);
  const removeField = useFormBuilderStore((s) => s.removeField);
  const selectField = useFormBuilderStore((s) => s.selectField);

  // ─── Local State ─────────────────────────────────────
  const [tab, setTab]               = useState<TabKey>("builder");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [snack, setSnack]           = useState<string | null>(null);
  const [autoSaved, setAutoSaved]   = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── API ─────────────────────────────────────────────
  const saveMutation   = useSaveFormSchemaMutation();
  const responsesQuery = useFormResponsesQuery(schema.id);

  const fieldsSig = useMemo(
    () => JSON.stringify(schema.fields),
    [schema.fields]
  );

  // ─── Handlers ────────────────────────────────────────
  const handleSave = useCallback(() => {
    saveMutation.mutate(schema, {
      onSuccess: () => {
        setSnack(t("saved"));
        setSchema(createEmptySchema());
        setTab("builder");
      },
      onError: () => setSnack("Save failed"),
    });
  }, [saveMutation, schema, t, setSchema]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/fill/${schema.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setSnack(t("linkCopied"));
    } catch {
      setSnack(url);
    }
  }, [schema.id, t]);

  const handleExport = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify(schema, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${schema.title.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [schema]);

  const handleImport = useCallback(
    (file: File) => {
      file
        .text()
        .then((txt) => {
          const parsed = parseFormSchemaJson(JSON.parse(txt));
          parsed.id        = parsed.id || generateFieldId();
          parsed.updatedAt = new Date().toISOString();
          setSchema(parsed);
          setSnack("Imported");
        })
        .catch(() => setSnack("Invalid JSON"));
    },
    [setSchema]
  );

  const confirmDelete = useCallback(() => {
    if (deleteId) removeField(deleteId);
    setDeleteId(null);
  }, [deleteId, removeField]);

  const openFieldSettings = useCallback(
    (id: string) => {
      selectField(id);
      setDrawerOpen(true);
    },
    [selectField]
  );

  // ─── Auto-save ───────────────────────────────────────
  const mutateSave = saveMutation.mutate;
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const current = useFormBuilderStore.getState().schema;
      if (current.fields.length > 0) {
        mutateSave(current, {
          onSuccess: () => setAutoSaved(true),
        });
        setTimeout(() => setAutoSaved(false), 3000);
      }
    }, 1500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [schema.id, schema.title, schema.description, fieldsSig, mutateSave]);

  // ─── Render ──────────────────────────────────────────
  return (
    <Box>
      {/* Header */}
      <DashboardHeader
        schema={schema}
        isSaving={saveMutation.isPending}
        autoSaved={autoSaved}
        fileInputRef={fileInputRef}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onSave={handleSave}
        onShare={handleShare}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current?.click()}
        onFileChange={handleImport}
      />

      {/* Tabs */}
      <DashboardTabs
        value={tab}
        onChange={setTab}
        fieldCount={schema.fields.length}
        responseCount={responsesQuery.data?.length ?? 0}
      />

      {/* Tab Panels */}
      {tab === "builder" && (
        <BuilderTab
          fields={schema.fields}
          onRequestDelete={setDeleteId}
          onOpenFieldSettings={openFieldSettings}
        />
      )}
      {tab === "preview" && (
        <PreviewTab
          schema={schema}
          fieldsSig={fieldsSig}
          onPreviewSubmit={() => setSnack("Preview: validation passed")}
        />
      )}
      {tab === "responses" && (
        <ResponsesTab
          fields={schema.fields}
          rows={responsesQuery.data ?? []}
        />
      )}

      {/* Global UI */}
      <FieldEditorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <ConfirmDeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
      <AppSnackbar message={snack} onClose={() => setSnack(null)} />
    </Box>
  );
}
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { BuilderFieldList } from "@/components/builder/BuilderFieldList";
import { FieldEditorDrawer } from "@/components/builder/FieldEditorDrawer";
import { AddFieldMenu } from "@/components/builder/AddFieldMenu";
import { ConfirmDeleteDialog } from "@/components/builder/ConfirmDeleteDialog";
import { FormRenderer } from "@/components/FormRenderer";
import { ResponsesTable } from "@/components/ResponsesTable";
import { useI18n } from "@/hooks/useI18n";
import { useSaveFormSchemaMutation, useFormResponsesQuery } from "@/hooks/useFormApi";
import { parseFormSchemaJson } from "@/schemas/formSchema.zod";
import { generateFieldId, createEmptySchema } from "@/schemas/formDefaults";

type TabKey = "builder" | "preview" | "responses";

export function DashboardPage() {
  const { t } = useI18n();
  const schema = useFormBuilderStore((s) => s.schema);
  const setTitle = useFormBuilderStore((s) => s.setTitle);
  const setDescription = useFormBuilderStore((s) => s.setDescription);
  const setSchema = useFormBuilderStore((s) => s.setSchema);
  const removeField = useFormBuilderStore((s) => s.removeField);
  const selectField = useFormBuilderStore((s) => s.selectField);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<TabKey>("builder");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const saveMutation = useSaveFormSchemaMutation();
  const responsesQuery = useFormResponsesQuery(schema.id);

  const fieldsSig = useMemo(() => JSON.stringify(schema.fields), [schema.fields]);

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

  /** Auto-sync to mock API so share URLs work without an extra click */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mutateSave = saveMutation.mutate;
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const currentSchema = useFormBuilderStore.getState().schema;
      if (currentSchema.fields.length > 0) {
        mutateSave(currentSchema);
      }
    }, 1500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [schema.id, schema.title, schema.description, fieldsSig, mutateSave]);

  const copyShare = useCallback(async () => {
    const url = `${window.location.origin}/fill/${schema.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setSnack(t("linkCopied"));
    } catch {
      setSnack(url);
    }
  }, [schema.id, t]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${schema.title.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [schema]);

  const importJson = useCallback(
    (file: File) => {
      file
        .text()
        .then((txt) => {
          const parsed = parseFormSchemaJson(JSON.parse(txt));
          parsed.id = parsed.id || generateFieldId();
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

  return (
    <Box>
      <Toolbar disableGutters sx={{ gap: 1, flexWrap: "wrap", py: 1 }}>
        <TextField
          size="small"
          label={t("formTitle")}
          value={schema.title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <TextField
          size="small"
          label={t("description")}
          value={schema.description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <AddFieldMenu />
        <Tooltip title={t("save")}>
          <IconButton
            color="primary"
            onClick={handleSave}
            disabled={saveMutation.isPending || schema.fields.length === 0}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("share")}>
          <IconButton onClick={copyShare}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("exportJson")}>
          <IconButton onClick={exportJson}>
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("importJson")}>
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <FileUploadIcon />
          </IconButton>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importJson(f);
            e.target.value = "";
          }}
        />
      </Toolbar>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tab value="builder" label={t("builder")} />
        <Tab value="preview" label={t("preview")} />
        <Tab value="responses" label={t("responses")} />
      </Tabs>

      {tab === "builder" && (
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
          <Card variant="outlined" sx={{ flex: 1, width: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t("reloadHint")}
              </Typography>
              <BuilderFieldList onRequestDelete={setDeleteId} onOpenFieldSettings={openFieldSettings} />
            </CardContent>
          </Card>
        </Stack>
      )}

      {tab === "preview" && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {schema.title}
            </Typography>
            <FormRenderer
              key={fieldsSig}
              schema={schema}
              preview
              onPreviewSubmit={() => setSnack("Preview: validation passed")}
            />
          </CardContent>
        </Card>
      )}

      {tab === "responses" && (
        <ResponsesTable fields={schema.fields} rows={responsesQuery.data ?? []} />
      )}

      <FieldEditorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ConfirmDeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}>
        <Alert severity="info" onClose={() => setSnack(null)} sx={{ width: "100%" }}>
          {snack}
        </Alert>
      </Snackbar>
    </Box>
  );
}

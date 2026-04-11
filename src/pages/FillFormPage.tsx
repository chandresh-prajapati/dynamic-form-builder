import { useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { FormRenderer } from "@/components/FormRenderer";
import { useFormSchemaQuery, useSubmitFormMutation } from "@/hooks/useFormApi";
import { useI18n } from "@/hooks/useI18n";

export function FillFormPage() {
  const { formId } = useParams<{ formId: string }>();
  const { t } = useI18n();
  const q = useFormSchemaQuery(formId);
  const submitMut = useSubmitFormMutation();
  const [snack, setSnack] = useState<string | null>(null);

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      if (!formId) return;
      submitMut.mutate(
        { formId, data },
        {
          onSuccess: () => setSnack(t("success")),
          onError: () => setSnack("Submit failed"),
        }
      );
    },
    [formId, submitMut, t]
  );

  if (!formId) {
    return <Typography>{t("notFound")}</Typography>;
  }

  if (q.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress aria-label={t("loading")} />
      </Box>
    );
  }

  if (q.isError || !q.data) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {t("notFound")} — Save your form from the admin dashboard so it exists in the mock API.
      </Typography>
    );
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 640, mx: "auto" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {q.data.title}
        </Typography>
        <FormRenderer key={q.data.updatedAt} schema={q.data} onSubmitSuccess={onSubmit} />
      </CardContent>
      <Snackbar open={!!snack} autoHideDuration={5000} onClose={() => setSnack(null)}>
        <Alert severity="success" onClose={() => setSnack(null)}>
          {snack}
        </Alert>
      </Snackbar>
    </Card>
  );
}

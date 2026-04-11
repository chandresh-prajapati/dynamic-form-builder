import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAllFormsQuery, useDeleteFormMutation } from "@/hooks/useFormApi";
import { useI18n } from "@/hooks/useI18n";
import { useUiStore } from "@/store/uiStore";
import { useFormBuilderStore } from "@/store/formBuilderStore";

export function UserFormsPage() {
  const { t } = useI18n();
  const role = useUiStore((s) => s.role);
  const q = useAllFormsQuery();
  const deleteMutation = useDeleteFormMutation();
  const navigate = useNavigate();
  const loadFromRemote = useFormBuilderStore((s) => s.loadFromRemote);

  const sorted = useMemo(() => {
    const list = q.data ?? [];
    return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [q.data]);

  if (q.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t("userDashboard")}</Typography>
      {sorted.length === 0 ? (
        <Typography color="text.secondary">No published forms yet.</Typography>
      ) : (
        sorted.map((f) => (
          <Card key={f.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{f.title}</Typography>
              {f.description ? (
                <Typography variant="body2" color="text.secondary">
                  {f.description}
                </Typography>
              ) : null}
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button component={Link} to={`/fill/${f.id}`} variant="contained" size="small">
                {t("openForm")}
              </Button>
              {role === "admin" && (
                <Stack direction="row" spacing={1}>
                  <Tooltip title={t("edit") || "Edit"}>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => {
                        loadFromRemote(f);
                        navigate("/admin");
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("delete") || "Delete"}>
                    <IconButton
                      color="error"
                      size="small"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${f.title}"?`)) {
                            deleteMutation.mutate(f.id);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </CardActions>
          </Card>
        ))
      )}
    </Stack>
  );
}

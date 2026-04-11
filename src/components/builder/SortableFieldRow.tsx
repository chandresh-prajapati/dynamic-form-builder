import { memo, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { sortableTransformToCss } from "@/utils/sortableTransform";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Card, CardActionArea, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useI18n } from "@/hooks/useI18n";
import type { FormField } from "@/types/form";

export interface SortableFieldRowProps {
  field: FormField;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpenSettings: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SortableFieldRow = memo(function SortableFieldRow({
  field,
  selected,
  onSelect,
  onOpenSettings,
  onDuplicate,
  onDelete,
}: SortableFieldRowProps) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: sortableTransformToCss(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  const stop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      variant="outlined"
      sx={{
        mb: 1,
        borderColor: selected ? "primary.main" : undefined,
        borderWidth: selected ? 2 : 1,
      }}
    >
      <Stack direction="row" alignItems="stretch">
        <Box
          {...attributes}
          {...listeners}
          sx={{
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            px: 0.5,
            bgcolor: "action.hover",
          }}
          aria-label="Drag to reorder"
        >
          <DragIndicatorIcon color="action" />
        </Box>
        <CardActionArea onClick={() => onSelect(field.id)} sx={{ flex: 1, alignItems: "stretch" }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1.5, width: "100%" }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={600} noWrap>
                {field.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {field.type}
                {field.required ? " · required" : ""}
              </Typography>
            </Box>
            {field.visibility ? <Chip size="small" label="conditional" color="secondary" variant="outlined" /> : null}
          </Stack>
        </CardActionArea>
        <Stack direction="row" alignItems="center" onClick={stop}>
          <Tooltip title={t("fieldSettings")}>
            <IconButton
              aria-label={t("fieldSettings")}
              color={selected ? "primary" : "default"}
              onClick={() => onOpenSettings(field.id)}
              size="small"
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton aria-label="Duplicate field" onClick={() => onDuplicate(field.id)} size="small">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Delete field" color="error" onClick={() => onDelete(field.id)} size="small">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
});

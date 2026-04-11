import { useCallback, useMemo } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Typography } from "@mui/material";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { SortableFieldRow } from "./SortableFieldRow";
import { useI18n } from "@/hooks/useI18n";

export function BuilderFieldList({
  onRequestDelete,
  onOpenFieldSettings,
}: {
  onRequestDelete: (id: string) => void;
  onOpenFieldSettings: (id: string) => void;
}) {
  const { t } = useI18n();
  const fields = useFormBuilderStore((s) => s.schema.fields);
  const selectedFieldId = useFormBuilderStore((s) => s.selectedFieldId);
  const selectField = useFormBuilderStore((s) => s.selectField);
  const duplicateField = useFormBuilderStore((s) => s.duplicateField);
  const reorderFields = useFormBuilderStore((s) => s.reorderFields);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = useMemo(() => fields.map((f) => f.id), [fields]);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over || active.id === over.id) return;
      reorderFields(String(active.id), String(over.id));
    },
    [reorderFields]
  );

  if (fields.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">{t("noFields")}</Typography>
      </Box>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {fields.map((f) => (
          <SortableFieldRow
            key={f.id}
            field={f}
            selected={selectedFieldId === f.id}
            onSelect={selectField}
            onDuplicate={duplicateField}
            onDelete={onRequestDelete}
            onOpenSettings={onOpenFieldSettings}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

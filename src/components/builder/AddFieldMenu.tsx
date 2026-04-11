import { useState, useCallback, memo } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button, Menu, MenuItem } from "@mui/material";
import type { FieldType } from "@/types/form";
import { defaultFieldForType } from "@/schemas/formDefaults";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { useI18n } from "@/hooks/useI18n";

const TYPES: FieldType[] = [
  "text",
  "number",
  "email",
  "password",
  "select",
  "radio",
  "checkbox",
  "date",
  "file",
  "textarea",
];

export const AddFieldMenu = memo(function AddFieldMenu() {
  const { t } = useI18n();
  const addField = useFormBuilderStore((s) => s.addField);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const close = useCallback(() => setAnchor(null), []);

  const pick = useCallback(
    (type: FieldType) => {
      addField(defaultFieldForType(type));
      close();
    },
    [addField, close]
  );

  return (
    <>
      <Button startIcon={<AddIcon />} variant="contained" onClick={(e) => setAnchor(e.currentTarget)}>
        {t("addField")}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        {TYPES.map((type) => (
          <MenuItem key={type} onClick={() => pick(type)}>
            {type}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

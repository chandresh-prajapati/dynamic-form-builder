import { useState, useCallback, memo } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button, Menu, MenuItem } from "@mui/material";
import type { FieldType } from "@/types/form";
import { defaultFieldForType } from "@/schemas/formDefaults";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { useI18n } from "@/hooks/useI18n";
import { colorTokens } from "@/theme/palette";

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
      <Button sx={{
        borderRadius: 1,
        background: colorTokens.gradients.accent,
        boxShadow: `0 2px 12px ${colorTokens.ocean[500]}35`,
        "&:hover": {
          background: colorTokens.gradients.accent,
          transform: "translateY(-1px)",
          boxShadow: `0 6px 20px ${colorTokens.ocean[500]}45`,
        },

      }} startIcon={<AddIcon />} variant="contained" onClick={(e) => setAnchor(e.currentTarget)}>
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

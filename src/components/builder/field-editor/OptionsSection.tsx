// src/components/builder/field-editor/OptionsSection.tsx
import { Box, IconButton, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import { SectionCard } from "./SectionCard";
import { colorTokens, extendedPalette } from "@/theme/palette";
import type { FormField } from "@/types/form";

interface OptionsSectionProps {
    field: FormField;
    patch: (p: Partial<FormField>) => void;
    t: any;
}

export function OptionsSection({ field, patch, t }: OptionsSectionProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const ext = isDark ? extendedPalette.dark : extendedPalette.light;

    const options = field.options ?? [];

    const updateOption = (
        idx: number,
        key: "label" | "value",
        val: string
    ) => {
        const updated = options.map((o, i) =>
            i === idx ? { ...o, [key]: val } : o
        );
        patch({ options: updated });
    };

    const removeOption = (idx: number) => {
        const updated = options.filter((_, i) => i !== idx);
        patch({ options: updated.length ? updated : [{ label: "Option A", value: "option_a" }] });
    };

    const addOption = () => {
        const n = options.length + 1;
        patch({
            options: [
                ...options,
                { label: `Option ${n}`, value: `option_${n}` },
            ],
        });
    };

    return (
        <SectionCard
            title="Options"
            icon={<ListRoundedIcon />}
            iconColor="#EC4899"
            badge={options.length}
        >
            <Stack spacing={1.25}>
                {/* Header labels */}
                <Stack direction="row" spacing={1} sx={{ px: 3 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            flex: 1,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "text.disabled",
                        }}
                    >
                        Label
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            flex: 1,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "text.disabled",
                        }}
                    >
                        Value
                    </Typography>
                </Stack>

                {/* Options list */}
                {options.map((option, idx) => (
                    <Stack
                        key={idx}
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            border: `1px solid ${ext.border.light}`,
                            bgcolor: isDark ? "rgba(255,255,255,0.02)" : colorTokens.slate[50],
                            "&:hover": {
                                borderColor: "#EC489940",
                                bgcolor: isDark ? "rgba(236,72,153,0.05)" : "rgba(236,72,153,0.03)",
                                "& .drag-handle": { opacity: 1 },
                            },
                            transition: "all 0.15s ease",
                        }}
                    >
                        {/* Drag handle */}
                        <DragIndicatorRoundedIcon
                            className="drag-handle"
                            sx={{
                                fontSize: 16,
                                color: "text.disabled",
                                opacity: 0.4,
                                cursor: "grab",
                                flexShrink: 0,
                                transition: "opacity 0.15s ease",
                            }}
                        />

                        {/* Label */}
                        <TextField
                            size="small"
                            value={option.label}
                            onChange={(e) => updateOption(idx, "label", e.target.value)}
                            placeholder="Label"
                            sx={{
                                flex: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                    fontSize: "0.8125rem",
                                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                                    "& fieldset": { borderColor: ext.border.light },
                                },
                            }}
                        />

                        {/* Value */}
                        <TextField
                            size="small"
                            value={option.value}
                            onChange={(e) => updateOption(idx, "value", e.target.value)}
                            placeholder="value"
                            sx={{
                                flex: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                    fontSize: "0.8125rem",
                                    fontFamily: "monospace",
                                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                                    "& fieldset": { borderColor: ext.border.light },
                                },
                            }}
                        />

                        {/* Remove */}
                        <Tooltip title="Remove option" arrow>
                            <IconButton
                                size="small"
                                onClick={() => removeOption(idx)}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 1,
                                    flexShrink: 0,
                                    color: "text.disabled",
                                    "&:hover": {
                                        bgcolor: isDark
                                            ? colorTokens.status.error.bgDark
                                            : colorTokens.status.error.bg,
                                        color: colorTokens.status.error.main,
                                    },
                                }}
                            >
                                <DeleteRoundedIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ))}

                {/* Add Option */}
                <Box
                    onClick={addOption}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.5,
                        py: 1,
                        borderRadius: 1,
                        border: `1.5px dashed ${ext.border.main}`,
                        cursor: "pointer",
                        color: "text.secondary",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: "#EC4899",
                            bgcolor: isDark ? "rgba(236,72,153,0.06)" : "rgba(236,72,153,0.04)",
                            color: "#EC4899",
                        },
                    }}
                >
                    <AddRoundedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8125rem" }}>
                        Add Option
                    </Typography>
                </Box>
            </Stack>
        </SectionCard>
    );
}
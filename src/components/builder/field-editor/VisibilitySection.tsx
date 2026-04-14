import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import { SectionCard } from "./SectionCard";
import { colorTokens, extendedPalette } from "@/theme/palette";
import type { FormField, VisibilityOperator } from "@/types/form";

const OPS: { value: VisibilityOperator; label: string; hasValue: boolean }[] = [
    { value: "equals", label: "Equals", hasValue: true },
    { value: "notEquals", label: "Not Equals", hasValue: true },
    { value: "isEmpty", label: "Is Empty", hasValue: false },
    { value: "isNotEmpty", label: "Is Not Empty", hasValue: false },
];

interface VisibilitySectionProps {
    field: FormField;
    otherFields: FormField[];
    patch: (p: Partial<FormField>) => void;
    t: any;
}

export function VisibilitySection({
    field,
    otherFields,
    patch,
    t,
}: VisibilitySectionProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const ext = isDark ? extendedPalette.dark : extendedPalette.light;

    const hasCondition = !!field.visibility;
    const selectedOp = OPS.find((o) => o.value === field.visibility?.operator);

    return (
        <SectionCard
            title="Visibility"
            icon={<VisibilityRoundedIcon />}
            iconColor="#8B5CF6"
            badge={hasCondition ? "ON" : undefined}
        >
            <Stack spacing={1.75}>
                {/* Info hint */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        p: 1.25,
                        borderRadius: 1,
                        bgcolor: isDark ? "rgba(139,92,246,0.08)" : "rgba(139,92,246,0.05)",
                        border: `1px solid rgba(139,92,246,0.15)`,
                    }}
                >
                    <LinkRoundedIcon sx={{ fontSize: 15, color: "#8B5CF6", mt: 0.1 }} />
                    <Typography
                        variant="caption"
                        sx={{ color: isDark ? "#C4B5FD" : "#6D28D9", lineHeight: 1.5, fontSize: "0.7rem" }}
                    >
                        Show or hide this field based on another field's value.
                    </Typography>
                </Box>

                {/* Depends on field */}
                <FormControl size="small" fullWidth>
                    <InputLabel>{t("dependsOn")}</InputLabel>
                    <Select
                        label={t("dependsOn")}
                        value={field.visibility?.dependsOnFieldId ?? ""}
                        onChange={(e) => {
                            const id = e.target.value;
                            patch({
                                visibility: id
                                    ? {
                                        dependsOnFieldId: id,
                                        operator: field.visibility?.operator ?? "equals",
                                        value: field.visibility?.value,
                                    }
                                    : undefined,
                            });
                        }}
                        sx={{
                            borderRadius: 1,
                            bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
                        }}
                    >
                        <MenuItem value="">
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                No condition (always visible)
                            </Typography>
                        </MenuItem>
                        {otherFields.map((f) => (
                            <MenuItem key={f.id} value={f.id} sx={{ borderRadius: 1, mx: 0.5 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {f.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ({f.type})
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Condition builder */}
                {hasCondition && (
                    <Box
                        sx={{
                            pl: 2,
                            borderLeft: `2px solid #8B5CF6`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.25,
                        }}
                    >
                        {/* Operator */}
                        <FormControl size="small" fullWidth>
                            <InputLabel>{t("operator")}</InputLabel>
                            <Select
                                label={t("operator")}
                                value={field.visibility!.operator}
                                onChange={(e) =>
                                    patch({
                                        visibility: {
                                            ...field.visibility!,
                                            operator: e.target.value as VisibilityOperator,
                                        },
                                    })
                                }
                                sx={{
                                    borderRadius: 1,
                                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
                                }}
                            >
                                {OPS.map((op) => (
                                    <MenuItem key={op.value} value={op.value} sx={{ borderRadius: 1, mx: 0.5 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {op.label}
                                            </Typography>
                                            {!op.hasValue && (
                                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem" }}>
                                                    no value needed
                                                </Typography>
                                            )}
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Compare value (only for equals/notEquals) */}
                        {selectedOp?.hasValue && (
                            <TextField
                                size="small"
                                label={t("compareValue")}
                                fullWidth
                                value={field.visibility!.value ?? ""}
                                onChange={(e) =>
                                    patch({
                                        visibility: { ...field.visibility!, value: e.target.value },
                                    })
                                }
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 1,
                                        bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
                                    },
                                }}
                            />
                        )}

                        {/* Preview hint */}
                        <Box
                            sx={{
                                px: 1.25,
                                py: 0.875,
                                borderRadius: 1,
                                bgcolor: isDark ? "rgba(139,92,246,0.06)" : "rgba(139,92,246,0.04)",
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "#8B5CF6", fontSize: "0.68rem", fontWeight: 600 }}>
                                Show when:{" "}
                                <Box component="span" sx={{ opacity: 0.8, fontWeight: 500 }}>
                                    [{otherFields.find((f) => f.id === field.visibility?.dependsOnFieldId)?.label ?? "field"}]{" "}
                                    {field.visibility?.operator}{" "}
                                    {selectedOp?.hasValue ? `"${field.visibility?.value ?? ""}"` : ""}
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Stack>
        </SectionCard>
    );
}
// src/components/builder/field-editor/ValidationSection.tsx
import {
    Box,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import TextDecreaseRoundedIcon from "@mui/icons-material/TextDecreaseRounded";
import TextIncreaseRoundedIcon from "@mui/icons-material/TextIncreaseRounded";
import AbcRoundedIcon from "@mui/icons-material/AbcRounded";
import { SectionCard } from "./SectionCard";
import { colorTokens, extendedPalette } from "@/theme/palette";
import type { FormField } from "@/types/form";

interface ValidationSectionProps {
    field: FormField;
    patch: (p: Partial<FormField>) => void;
    t: any;
}

export function ValidationSection({ field, patch, t }: ValidationSectionProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const ext = isDark ? extendedPalette.dark : extendedPalette.light;

    const hasTextValidation =
        field.type === "text" ||
        field.type === "textarea" ||
        field.type === "password" ||
        field.type === "email";
    const hasNumberValidation = field.type === "number";
    const hasPatternValidation =
        field.type === "text" || field.type === "textarea";

    // Count active rules
    const activeRules = [
        field.validation?.minLength !== undefined,
        field.validation?.maxLength !== undefined,
        field.validation?.min !== undefined,
        field.validation?.max !== undefined,
        !!field.validation?.pattern,
    ].filter(Boolean).length;

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 1,
            bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
        },
    };

    return (
        <SectionCard
            title="Validation"
            icon={<ShieldRoundedIcon />}
            iconColor={colorTokens.status.warning.dark}
            badge={activeRules > 0 ? activeRules : undefined}
        >
            <Stack spacing={1.75}>
                {/* Text validation */}
                {hasTextValidation && (
                    <Stack spacing={1.25}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: "text.disabled",
                            }}
                        >
                            Length
                        </Typography>

                        <Stack direction="row" spacing={1}>
                            <TextField
                                size="small"
                                label={t("minLength")}
                                type="number"
                                fullWidth
                                value={field.validation?.minLength ?? ""}
                                onChange={(e) =>
                                    patch({
                                        validation: {
                                            ...field.validation,
                                            minLength:
                                                e.target.value === "" ? undefined : Number(e.target.value),
                                        },
                                    })
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TextDecreaseRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputSx}
                            />
                            <TextField
                                size="small"
                                label={t("maxLength")}
                                type="number"
                                fullWidth
                                value={field.validation?.maxLength ?? ""}
                                onChange={(e) =>
                                    patch({
                                        validation: {
                                            ...field.validation,
                                            maxLength:
                                                e.target.value === "" ? undefined : Number(e.target.value),
                                        },
                                    })
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TextIncreaseRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputSx}
                            />
                        </Stack>
                    </Stack>
                )}

                {/* Number validation */}
                {hasNumberValidation && (
                    <Stack spacing={1.25}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: "text.disabled",
                            }}
                        >
                            Range
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <TextField
                                size="small"
                                label={t("min")}
                                type="number"
                                fullWidth
                                value={field.validation?.min ?? ""}
                                onChange={(e) =>
                                    patch({
                                        validation: {
                                            ...field.validation,
                                            min:
                                                e.target.value === "" ? undefined : Number(e.target.value),
                                        },
                                    })
                                }
                                sx={inputSx}
                            />
                            <TextField
                                size="small"
                                label={t("max")}
                                type="number"
                                fullWidth
                                value={field.validation?.max ?? ""}
                                onChange={(e) =>
                                    patch({
                                        validation: {
                                            ...field.validation,
                                            max:
                                                e.target.value === "" ? undefined : Number(e.target.value),
                                        },
                                    })
                                }
                                sx={inputSx}
                            />
                        </Stack>
                    </Stack>
                )}

                {/* Pattern */}
                {hasPatternValidation && (
                    <Stack spacing={0.75}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: "text.disabled",
                            }}
                        >
                            Pattern (Regex)
                        </Typography>
                        <TextField
                            size="small"
                            label={t("pattern")}
                            fullWidth
                            placeholder="e.g. ^[A-Za-z]+$"
                            value={field.validation?.pattern ?? ""}
                            onChange={(e) =>
                                patch({
                                    validation: {
                                        ...field.validation,
                                        pattern: e.target.value || undefined,
                                    },
                                })
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AbcRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                    fontFamily: "monospace",
                                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
                                },
                            }}
                        />
                        {field.validation?.pattern && (
                            <Box
                                sx={{
                                    px: 1.25,
                                    py: 0.75,
                                    borderRadius: 1,
                                    bgcolor: isDark
                                        ? colorTokens.status.info.bgDark
                                        : colorTokens.status.info.bg,
                                    border: `1px solid ${colorTokens.status.info.main}20`,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: "monospace",
                                        fontSize: "0.7rem",
                                        color: isDark
                                            ? colorTokens.status.info.light
                                            : colorTokens.status.info.dark,
                                    }}
                                >
                                    /{field.validation.pattern}/
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                )}

                {/* No validation available */}
                {!hasTextValidation && !hasNumberValidation && !hasPatternValidation && (
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ fontStyle: "italic", textAlign: "center", py: 1 }}
                    >
                        No validation rules available for {field.type} fields.
                    </Typography>
                )}
            </Stack>
        </SectionCard>
    );
}
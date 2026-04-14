// src/components/builder/field-editor/BasicSettingsSection.tsx
import {
    Box,
    Chip,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AsteriskIcon from "@mui/icons-material/Emergency";
import { SectionCard } from "./SectionCard";
import { colorTokens, extendedPalette } from "@/theme/palette";
import type { FieldType, FormField } from "@/types/form";

const FIELD_TYPES: { value: FieldType; label: string; group: string }[] = [
    { value: "text", label: "Text", group: "Input" },
    { value: "number", label: "Number", group: "Input" },
    { value: "email", label: "Email", group: "Input" },
    { value: "password", label: "Password", group: "Input" },
    { value: "textarea", label: "Textarea", group: "Input" },
    { value: "select", label: "Select", group: "Choice" },
    { value: "radio", label: "Radio", group: "Choice" },
    { value: "checkbox", label: "Checkbox", group: "Choice" },
    { value: "date", label: "Date", group: "Picker" },
    { value: "file", label: "File Upload", group: "Picker" },
];

interface BasicSettingsSectionProps {
    field: FormField;
    patch: (p: Partial<FormField>) => void;
    t: any;
}

export function BasicSettingsSection({ field, patch, t }: BasicSettingsSectionProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const ext = isDark ? extendedPalette.dark : extendedPalette.light;

    const showPlaceholder =
        field.type !== "checkbox" &&
        field.type !== "radio" &&
        field.type !== "file";

    return (
        <SectionCard
            title="Basic"
            icon={<EditRoundedIcon />}
            iconColor={colorTokens.ocean[isDark ? 400 : 600]}
        >
            <Stack spacing={2}>
                {/* Label */}
                <TextField
                    size="small"
                    label={t("label")}
                    fullWidth
                    value={field.label}
                    onChange={(e) => patch({ label: e.target.value })}
                    InputProps={{
                        startAdornment: (
                            <EditRoundedIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.75 }} />
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
                        },
                    }}
                />

                {/* Field Type */}
                <FormControl size="small" fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        label="Type"
                        value={field.type}
                        onChange={(e) => patch({ type: e.target.value as FieldType })}
                        sx={{
                            borderRadius: 1,
                            bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
                        }}
                    >
                        {["Input", "Choice", "Picker"].map((group) => [
                            <MenuItem
                                key={`group-${group}`}
                                disabled
                                sx={{
                                    fontSize: "0.65rem",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: "text.disabled",
                                    py: 0.5,
                                }}
                            >
                                {group}
                            </MenuItem>,
                            ...FIELD_TYPES.filter((ft) => ft.group === group).map((ft) => (
                                <MenuItem key={ft.value} value={ft.value} sx={{ borderRadius: 1, mx: 0.5 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {ft.label}
                                    </Typography>
                                </MenuItem>
                            )),
                        ])}
                    </Select>
                </FormControl>

                {/* Placeholder */}
                {showPlaceholder && (
                    <TextField
                        size="small"
                        label={t("placeholder")}
                        fullWidth
                        value={field.placeholder ?? ""}
                        onChange={(e) => patch({ placeholder: e.target.value })}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                                bgcolor: isDark ? "rgba(255,255,255,0.03)" : colorTokens.slate[50],
                            },
                        }}
                    />
                )}

                {/* Required toggle */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 1,
                        border: `1px solid ${ext.border.light}`,
                        bgcolor: field.required
                            ? isDark
                                ? colorTokens.status.error.bgDark
                                : colorTokens.status.error.bg
                            : isDark
                                ? "rgba(255,255,255,0.02)"
                                : colorTokens.slate[50],
                        transition: "all 0.2s ease",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <AsteriskIcon
                            sx={{
                                fontSize: 14,
                                color: field.required
                                    ? colorTokens.status.error.main
                                    : "text.disabled",
                                transition: "color 0.2s ease",
                            }}
                        />
                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ fontSize: "0.8125rem" }}
                            >
                                {t("required")}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.7rem" }}
                            >
                                {field.required
                                    ? "Must be filled before submitting"
                                    : "Optional field"}
                            </Typography>
                        </Box>
                    </Stack>
                    <Switch
                        size="small"
                        checked={field.required}
                        onChange={(e) => patch({ required: e.target.checked })}
                        sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                                color: colorTokens.status.error.main,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                bgcolor: colorTokens.status.error.main,
                            },
                        }}
                    />
                </Box>
            </Stack>
        </SectionCard>
    );
}
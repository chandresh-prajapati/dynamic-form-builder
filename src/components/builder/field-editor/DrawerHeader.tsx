import { Box, Chip, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import ArrowDropDownCircleRoundedIcon from "@mui/icons-material/ArrowDropDownCircleRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { colorTokens, extendedPalette } from "@/theme/palette";
import type { FieldType } from "@/types/form";

const FIELD_TYPE_CONFIG: Record<
    string,
    { icon: React.ElementType; color: string; label: string }
> = {
    text: { icon: TextFieldsRoundedIcon, color: colorTokens.ocean[600], label: "Text" },
    email: { icon: EmailRoundedIcon, color: "#0EA5E9", label: "Email" },
    password: { icon: PasswordRoundedIcon, color: "#8B5CF6", label: "Password" },
    textarea: { icon: NotesRoundedIcon, color: colorTokens.teal[500], label: "Textarea" },
    number: { icon: NumbersRoundedIcon, color: "#F59E0B", label: "Number" },
    select: { icon: ArrowDropDownCircleRoundedIcon, color: "#EC4899", label: "Select" },
    radio: { icon: RadioButtonCheckedRoundedIcon, color: "#14B8A6", label: "Radio" },
    checkbox: { icon: CheckBoxRoundedIcon, color: "#10B981", label: "Checkbox" },
    date: { icon: CalendarMonthRoundedIcon, color: "#F97316", label: "Date" },
    file: { icon: AttachFileRoundedIcon, color: "#6366F1", label: "File" },
};

interface DrawerHeaderProps {
    fieldLabel: string;
    fieldType: FieldType;
    onClose: () => void;
}

export function DrawerHeader({ fieldLabel, fieldType, onClose }: DrawerHeaderProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const ext = isDark ? extendedPalette.dark : extendedPalette.light;

    const config = FIELD_TYPE_CONFIG[fieldType] ?? {
        icon: SettingsRoundedIcon,
        color: colorTokens.ocean[600],
        label: fieldType,
    };
    const FieldIcon = config.icon;

    return (
        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                px: 2.5,
                py: 2,
                borderBottom: `1px solid ${ext.border.light}`,
                background: isDark
                    ? `linear-gradient(145deg, ${colorTokens.slate[900]}, ${colorTokens.slate[800]})`
                    : `linear-gradient(145deg, #ffffff, ${colorTokens.slate[50]})`,
                backdropFilter: "blur(20px)",
            }}
        >
            {/* Top row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                {/* Left: icon + title */}
                <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: colorTokens.gradients.accent,
                            boxShadow: `0 2px 8px ${colorTokens.ocean[500]}30`,
                        }}
                    >
                        <SettingsRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
                    </Box>
                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={800}
                            sx={{
                                fontSize: "0.9375rem",
                                letterSpacing: "-0.02em",
                                background: isDark
                                    ? `linear-gradient(135deg, ${colorTokens.ocean[300]}, ${colorTokens.teal[300]})`
                                    : colorTokens.gradients.accent,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Field Settings
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            Configure field properties
                        </Typography>
                    </Box>
                </Stack>

                {/* Close button */}
                <Tooltip title="Close panel" arrow>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            border: `1px solid ${ext.border.light}`,
                            color: "text.secondary",
                            "&:hover": {
                                bgcolor: isDark
                                    ? colorTokens.status.error.bgDark
                                    : colorTokens.status.error.bg,
                                color: colorTokens.status.error.main,
                                borderColor: `${colorTokens.status.error.main}30`,
                            },
                        }}
                    >
                        <CloseRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* Selected field identity */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: isDark
                        ? `${config.color}10`
                        : `${config.color}08`,
                    border: `1px solid ${config.color}20`,
                }}
            >
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isDark ? `${config.color}20` : `${config.color}15`,
                        border: `1px solid ${config.color}25`,
                    }}
                >
                    <FieldIcon sx={{ fontSize: 18, color: config.color }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="body2"
                        fontWeight={700}
                        noWrap
                        sx={{ color: "text.primary", fontSize: "0.8125rem" }}
                    >
                        {fieldLabel || "Unnamed Field"}
                    </Typography>
                    <Chip
                        label={config.label}
                        size="small"
                        sx={{
                            height: 18,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            bgcolor: isDark ? `${config.color}20` : `${config.color}12`,
                            color: config.color,
                            "& .MuiChip-label": { px: 0.75 },
                            mt: 0.25,
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
// src/components/builder/field-editor/SectionCard.tsx
import { Box, Collapse, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { colorTokens, extendedPalette } from "@/theme/palette";

interface SectionCardProps {
    title: string;
    icon: React.ReactNode;
    iconColor?: string;
    iconBg?: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    badge?: string | number;
}

export function SectionCard({
    title,
    icon,
    iconColor = colorTokens.ocean[600],
    iconBg,
    children,
    defaultExpanded = true,
    badge,
}: SectionCardProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const ext = isDark ? extendedPalette.dark : extendedPalette.light;

    const [expanded, setExpanded] = useState(defaultExpanded);

    const resolvedBg = iconBg ?? (isDark ? `${iconColor}18` : `${iconColor}12`);

    return (
        <Box
            sx={{
                borderRadius: 1,
                border: `1px solid ${ext.border.light}`,
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
                overflow: "hidden",
                transition: "all 0.2s ease",
                "&:hover": {
                    borderColor: expanded ? ext.border.main : `${iconColor}40`,
                },
            }}
        >
            {/* Section Header */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.25}
                onClick={() => setExpanded((p) => !p)}
                sx={{
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    bgcolor: isDark
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(0,0,0,0.01)",
                    userSelect: "none",
                    "&:hover": {
                        bgcolor: isDark
                            ? "rgba(255,255,255,0.04)"
                            : resolvedBg,
                    },
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: resolvedBg,
                        border: `1px solid ${iconColor}20`,
                        flexShrink: 0,
                    }}
                >
                    <Box sx={{ "& svg": { fontSize: "16px !important", color: iconColor } }}>
                        {icon}
                    </Box>
                </Box>

                {/* Title + Badge */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: expanded ? iconColor : "text.secondary",
                                transition: "color 0.2s ease",
                            }}
                        >
                            {title}
                        </Typography>
                        {badge !== undefined && (
                            <Box
                                sx={{
                                    px: 0.75,
                                    py: 0.1,
                                    borderRadius: 1,
                                    bgcolor: resolvedBg,
                                    border: `1px solid ${iconColor}20`,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{ fontSize: "0.6rem", fontWeight: 800, color: iconColor }}
                                >
                                    {badge}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Box>

                {/* Expand toggle */}
                <IconButton
                    size="small"
                    sx={{
                        width: 24,
                        height: 24,
                        color: "text.disabled",
                        transition: "transform 0.25s ease",
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    <ExpandMoreRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Stack>

            {/* Content */}
            <Collapse in={expanded}>
                <Box sx={{ px: 2, pb: 2, pt: 1.5, height: "100%" }}>
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
}
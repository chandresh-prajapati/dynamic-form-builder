// src/theme/theme.ts
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import {
    lightPalette,
    darkPalette,
    colorTokens,
    extendedPalette,
} from "./palette";
import { typography } from "./typography";
import { Components, Theme } from "@mui/material";

// ─────────────────────────────────────────────────────
// COMPONENT OVERRIDES WITH NEW COLORS
// ─────────────────────────────────────────────────────
function getComponents(mode: "light" | "dark"): Components<Theme> {
    const ext = mode === "light" ? extendedPalette.light : extendedPalette.dark;

    return {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                        width: "6px",
                        height: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        borderRadius: "3px",
                        background:
                            mode === "dark"
                                ? "rgba(148, 163, 184, 0.2)"
                                : "rgba(0, 0, 0, 0.15)",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background:
                            mode === "dark"
                                ? "rgba(148, 163, 184, 0.3)"
                                : "rgba(0, 0, 0, 0.25)",
                    },
                },
            },
        },

        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: "8px 20px",
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                },
                contained: ({ theme }) => ({
                    background: colorTokens.gradients.primary,
                    "&:hover": {
                        background: colorTokens.gradients.primary,
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                    },
                    "&:active": {
                        transform: "translateY(0)",
                    },
                }),
                containedSecondary: {
                    background: colorTokens.gradients.secondary,
                    "&:hover": {
                        background: colorTokens.gradients.secondary,
                        boxShadow: `0 4px 16px ${colorTokens.coral[500]}40`,
                    },
                },
                outlined: {
                    borderWidth: "1.5px",
                    "&:hover": {
                        borderWidth: "1.5px",
                        transform: "translateY(-1px)",
                    },
                },
                text: {
                    "&:hover": {
                        backgroundColor: ext.accent.primarySoft,
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: `1px solid ${ext.border.light}`,
                    backgroundImage:
                        mode === "light"
                            ? colorTokens.gradients.card
                            : colorTokens.gradients.cardDark,
                    boxShadow:
                        mode === "dark"
                            ? "0 1px 3px rgba(0,0,0,0.3)"
                            : "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        borderColor: ext.border.main,
                        boxShadow:
                            mode === "dark"
                                ? "0 8px 30px rgba(0,0,0,0.4)"
                                : "0 8px 30px rgba(0,0,0,0.06)",
                        transform: "translateY(-2px)",
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                },
                colorPrimary: {
                    backgroundColor: ext.accent.primarySoft,
                    color:
                        mode === "dark"
                            ? colorTokens.ocean[300]
                            : colorTokens.ocean[700],
                },
                colorSecondary: {
                    backgroundColor: ext.accent.secondarySoft,
                    color:
                        mode === "dark"
                            ? colorTokens.coral[300]
                            : colorTokens.coral[700],
                },
                colorSuccess: {
                    backgroundColor: ext.accent.successSoft,
                    color:
                        mode === "dark"
                            ? colorTokens.status.success.light
                            : colorTokens.status.success.dark,
                },
                colorError: {
                    backgroundColor: ext.accent.errorSoft,
                    color:
                        mode === "dark"
                            ? colorTokens.status.error.light
                            : colorTokens.status.error.dark,
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: ext.header.bg,
                    backdropFilter: "blur(20px) saturate(180%)",
                    borderBottom: `1px solid ${ext.header.border}`,
                    boxShadow: "none",
                },
            },
        },

        MuiTextField: {
            defaultProps: { variant: "outlined", size: "small" },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 10,
                        transition: "all 0.2s ease",
                        "& fieldset": {
                            borderColor: ext.border.main,
                            borderWidth: "1.5px",
                        },
                        "&:hover fieldset": {
                            borderColor:
                                mode === "dark"
                                    ? colorTokens.ocean[400]
                                    : colorTokens.ocean[500],
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: ext.border.focus,
                            boxShadow: `0 0 0 3px ${ext.accent.primarySoft}`,
                        },
                    },
                },
            },
        },

        MuiSelect: {
            styleOverrides: {
                root: { borderRadius: 10 },
            },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 8,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    padding: "6px 12px",
                    backgroundColor:
                        mode === "dark"
                            ? colorTokens.slate[700]
                            : colorTokens.slate[800],
                    boxShadow:
                        mode === "dark"
                            ? "0 4px 14px rgba(0,0,0,0.4)"
                            : "0 4px 14px rgba(0,0,0,0.15)",
                },
                arrow: {
                    color:
                        mode === "dark"
                            ? colorTokens.slate[700]
                            : colorTokens.slate[800],
                },
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 1.50,
                    border: `1px solid ${ext.border.light}`,
                    boxShadow:
                        mode === "dark"
                            ? "0 24px 48px rgba(0,0,0,0.5)"
                            : "0 24px 48px rgba(0,0,0,0.12)",
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                rounded: { borderRadius: 12 },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    transition: "all 0.2s ease",
                },
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    transition: "all 0.2s ease",
                    "&.Mui-selected": {
                        backgroundColor: ext.sidebar.activeItem,
                        "&:hover": {
                            backgroundColor: ext.sidebar.activeItem,
                        },
                    },
                    "&:hover": {
                        backgroundColor: ext.sidebar.hoverItem,
                    },
                },
            },
        },

        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 46,
                    height: 26,
                    padding: 0,
                },
                switchBase: {
                    padding: 3,
                    "&.Mui-checked": {
                        transform: "translateX(20px)",
                        "& + .MuiSwitch-track": {
                            opacity: 1,
                            background: colorTokens.gradients.primary,
                        },
                    },
                },
                thumb: {
                    width: 20,
                    height: 20,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                },
                track: {
                    borderRadius: 13,
                    opacity: 1,
                    backgroundColor:
                        mode === "dark"
                            ? colorTokens.slate[700]
                            : colorTokens.slate[300],
                },
            },
        },

        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                    background: colorTokens.gradients.primary,
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    minHeight: 48,
                },
            },
        },

        MuiAlert: {
            styleOverrides: {
                standardSuccess: {
                    backgroundColor: ext.accent.successSoft,
                    border: `1px solid ${colorTokens.status.success.main}30`,
                },
                standardError: {
                    backgroundColor: ext.accent.errorSoft,
                    border: `1px solid ${colorTokens.status.error.main}30`,
                },
                standardWarning: {
                    backgroundColor: ext.accent.warningSoft,
                    border: `1px solid ${colorTokens.status.warning.main}30`,
                },
                standardInfo: {
                    backgroundColor: ext.accent.infoSoft,
                    border: `1px solid ${colorTokens.status.info.main}30`,
                },
                root: {
                    borderRadius: 12,
                },
            },
        },

        MuiBadge: {
            styleOverrides: {
                colorPrimary: {
                    background: colorTokens.gradients.primary,
                },
            },
        },
    };
}

// ─────────────────────────────────────────────────────
// THEME BUILDER
// ─────────────────────────────────────────────────────
export function buildTheme(mode: "light" | "dark") {
    let theme = createTheme({
        palette: mode === "light" ? lightPalette : darkPalette,
        typography,
        components: getComponents(mode),
        shape: { borderRadius: 12 },
        spacing: 8,
    });

    theme = responsiveFontSizes(theme);
    return theme;
}
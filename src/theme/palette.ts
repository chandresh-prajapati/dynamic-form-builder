// src/theme/palette.ts
import { PaletteOptions } from "@mui/material";

// ─────────────────────────────────────────────────────
// COLOR TOKENS (reference for consistency)
// ─────────────────────────────────────────────────────
export const colorTokens = {
    // Primary: Deep Ocean Blue → Professional & Trustworthy
    ocean: {
        50: "#EEF2FF",
        100: "#DBE4FF",
        200: "#BAC8FF",
        300: "#91A7FF",
        400: "#748FFC",
        500: "#5C7CFA",
        600: "#4C6EF5",
        700: "#4263EB",
        800: "#3B5BDB",
        900: "#364FC7",
    },

    // Secondary: Warm Coral → Energy & Creativity
    coral: {
        50: "#FFF4F1",
        100: "#FFE8E0",
        200: "#FFC9B5",
        300: "#FFA98A",
        400: "#FF8A65",
        500: "#FF7043",
        600: "#F4511E",
        700: "#E64A19",
        800: "#D84315",
        900: "#BF360C",
    },

    // Accent: Teal → Fresh & Modern
    teal: {
        50: "#E6FFFA",
        100: "#B2F5EA",
        200: "#81E6D9",
        300: "#4FD1C5",
        400: "#38B2AC",
        500: "#319795",
        600: "#2C7A7B",
        700: "#285E61",
        800: "#234E52",
        900: "#1D4044",
    },

    // Neutral: Cool Slate
    slate: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: "#334155",
        800: "#1E293B",
        900: "#0F172A",
        950: "#020617",
    },

    // Status Colors
    status: {
        success: {
            light: "#34D399",
            main: "#10B981",
            dark: "#059669",
            bg: "#ECFDF5",
            bgDark: "#064E3B",
        },
        error: {
            light: "#FB7185",
            main: "#F43F5E",
            dark: "#E11D48",
            bg: "#FFF1F2",
            bgDark: "#4C0519",
        },
        warning: {
            light: "#FBBF24",
            main: "#F59E0B",
            dark: "#D97706",
            bg: "#FFFBEB",
            bgDark: "#451A03",
        },
        info: {
            light: "#60A5FA",
            main: "#3B82F6",
            dark: "#2563EB",
            bg: "#EFF6FF",
            bgDark: "#1E3A5F",
        },
    },

    // Gradient Presets
    gradients: {
        primary: "linear-gradient(135deg, #4C6EF5 0%, #7C3AED 100%)",
        secondary: "linear-gradient(135deg, #FF7043 0%, #FF5252 100%)",
        accent: "linear-gradient(135deg, #38B2AC 0%, #4C6EF5 100%)",
        warm: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
        cool: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
        aurora: "linear-gradient(135deg, #4C6EF5 0%, #38B2AC 50%, #F59E0B 100%)",
        card: "linear-gradient(145deg, rgba(76,110,245,0.05) 0%, rgba(56,178,172,0.05) 100%)",
        cardDark: "linear-gradient(145deg, rgba(76,110,245,0.1) 0%, rgba(56,178,172,0.1) 100%)",
    },
} as const;

// ─────────────────────────────────────────────────────
// LIGHT THEME PALETTE
// ─────────────────────────────────────────────────────
export const lightPalette: PaletteOptions = {
    mode: "light",

    primary: {
        main: colorTokens.ocean[600],       // #4C6EF5
        light: colorTokens.ocean[400],      // #748FFC
        dark: colorTokens.ocean[800],       // #3B5BDB
        contrastText: "#FFFFFF",
    },

    secondary: {
        main: colorTokens.coral[500],       // #FF7043
        light: colorTokens.coral[300],      // #FFA98A
        dark: colorTokens.coral[700],       // #E64A19
        contrastText: "#FFFFFF",
    },

    background: {
        default: colorTokens.slate[50],     // #F8FAFC
        paper: "#FFFFFF",
    },

    text: {
        primary: colorTokens.slate[900],    // #0F172A
        secondary: colorTokens.slate[500],  // #64748B
        disabled: colorTokens.slate[400],   // #94A3B8
    },

    divider: colorTokens.slate[200],      // #E2E8F0

    error: {
        main: colorTokens.status.error.main,
        light: colorTokens.status.error.light,
        dark: colorTokens.status.error.dark,
    },

    warning: {
        main: colorTokens.status.warning.main,
        light: colorTokens.status.warning.light,
        dark: colorTokens.status.warning.dark,
    },

    success: {
        main: colorTokens.status.success.main,
        light: colorTokens.status.success.light,
        dark: colorTokens.status.success.dark,
    },

    info: {
        main: colorTokens.status.info.main,
        light: colorTokens.status.info.light,
        dark: colorTokens.status.info.dark,
    },

    action: {
        active: colorTokens.slate[600],
        hover: "rgba(76, 110, 245, 0.04)",
        selected: "rgba(76, 110, 245, 0.08)",
        disabled: colorTokens.slate[300],
        disabledBackground: colorTokens.slate[100],
        focus: "rgba(76, 110, 245, 0.12)",
    },
};

// ─────────────────────────────────────────────────────
// DARK THEME PALETTE
// ─────────────────────────────────────────────────────
export const darkPalette: PaletteOptions = {
    mode: "dark",

    primary: {
        main: colorTokens.ocean[400],       // #748FFC
        light: colorTokens.ocean[300],      // #91A7FF
        dark: colorTokens.ocean[600],       // #4C6EF5
        contrastText: "#FFFFFF",
    },

    secondary: {
        main: colorTokens.coral[400],       // #FF8A65
        light: colorTokens.coral[300],      // #FFA98A
        dark: colorTokens.coral[600],       // #F4511E
        contrastText: "#FFFFFF",
    },

    background: {
        default: colorTokens.slate[950],    // #020617
        paper: colorTokens.slate[900],      // #0F172A
    },

    text: {
        primary: colorTokens.slate[100],    // #F1F5F9
        secondary: colorTokens.slate[400],  // #94A3B8
        disabled: colorTokens.slate[600],   // #475569
    },

    divider: "rgba(148, 163, 184, 0.1)",  // Subtle slate divider

    error: {
        main: colorTokens.status.error.light,
        light: "#FDA4AF",
        dark: colorTokens.status.error.main,
    },

    warning: {
        main: colorTokens.status.warning.light,
        light: "#FDE68A",
        dark: colorTokens.status.warning.main,
    },

    success: {
        main: colorTokens.status.success.light,
        light: "#6EE7B7",
        dark: colorTokens.status.success.main,
    },

    info: {
        main: colorTokens.status.info.light,
        light: "#93C5FD",
        dark: colorTokens.status.info.main,
    },

    action: {
        active: colorTokens.slate[300],
        hover: "rgba(116, 143, 252, 0.08)",
        selected: "rgba(116, 143, 252, 0.16)",
        disabled: colorTokens.slate[700],
        disabledBackground: colorTokens.slate[800],
        focus: "rgba(116, 143, 252, 0.2)",
    },
};

// ─────────────────────────────────────────────────────
// CUSTOM EXTENDED PALETTE (for use in components)
// ─────────────────────────────────────────────────────
export const extendedPalette = {
    light: {
        // Surface variants for cards & sections
        surface: {
            soft: colorTokens.slate[50],
            main: "#FFFFFF",
            elevated: "#FFFFFF",
            overlay: "rgba(255, 255, 255, 0.9)",
        },
        // Accent backgrounds for chips, badges, highlights
        accent: {
            primarySoft: `${colorTokens.ocean[600]}12`,    // Very subtle primary bg
            secondarySoft: `${colorTokens.coral[500]}12`,
            successSoft: colorTokens.status.success.bg,
            errorSoft: colorTokens.status.error.bg,
            warningSoft: colorTokens.status.warning.bg,
            infoSoft: colorTokens.status.info.bg,
        },
        // Border colors
        border: {
            light: colorTokens.slate[200],
            main: colorTokens.slate[300],
            focus: colorTokens.ocean[600],
        },
        // Header/Navigation
        header: {
            bg: "rgba(255, 255, 255, 0.85)",
            border: colorTokens.slate[200],
        },
        // Sidebar
        sidebar: {
            bg: "#FFFFFF",
            activeItem: `${colorTokens.ocean[600]}10`,
            hoverItem: colorTokens.slate[100],
        },
    },
    dark: {
        surface: {
            soft: colorTokens.slate[800],
            main: colorTokens.slate[900],
            elevated: colorTokens.slate[800],
            overlay: "rgba(15, 23, 42, 0.9)",
        },
        accent: {
            primarySoft: `${colorTokens.ocean[400]}15`,
            secondarySoft: `${colorTokens.coral[400]}15`,
            successSoft: colorTokens.status.success.bgDark,
            errorSoft: colorTokens.status.error.bgDark,
            warningSoft: colorTokens.status.warning.bgDark,
            infoSoft: colorTokens.status.info.bgDark,
        },
        border: {
            light: "rgba(148, 163, 184, 0.08)",
            main: "rgba(148, 163, 184, 0.15)",
            focus: colorTokens.ocean[400],
        },
        header: {
            bg: "rgba(2, 6, 23, 0.85)",
            border: "rgba(148, 163, 184, 0.1)",
        },
        sidebar: {
            bg: colorTokens.slate[900],
            activeItem: `${colorTokens.ocean[400]}15`,
            hoverItem: colorTokens.slate[800],
        },
    },
} as const;
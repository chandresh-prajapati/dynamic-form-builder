// src/theme/components.ts
import { Components, Theme } from "@mui/material";

export const components: Components<Theme> = {
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                    borderRadius: "4px",
                    background: "rgba(0,0,0,0.2)",
                },
            },
        },
    },
    MuiButton: {
        defaultProps: {
            disableElevation: true,
        },
        styleOverrides: {
            root: {
                borderRadius: 10,
                padding: "8px 20px",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "all 0.2s ease-in-out",
            },
            contained: {
                "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                },
            },
            outlined: {
                borderWidth: "1.5px",
                "&:hover": {
                    borderWidth: "1.5px",
                },
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                border: "1px solid",
                borderColor: "rgba(0,0,0,0.08)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                },
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                fontWeight: 500,
            },
        },
    },
    MuiTextField: {
        defaultProps: {
            variant: "outlined",
            size: "small",
        },
        styleOverrides: {
            root: {
                "& .MuiOutlinedInput-root": {
                    borderRadius: 10,
                },
            },
        },
    },
    MuiSelect: {
        styleOverrides: {
            root: {
                borderRadius: 10,
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundImage: "none",
            },
        },
    },
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                borderRadius: 8,
                fontSize: "0.75rem",
                fontWeight: 500,
                padding: "6px 12px",
            },
        },
    },
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 16,
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            rounded: {
                borderRadius: 12,
            },
        },
    },
};
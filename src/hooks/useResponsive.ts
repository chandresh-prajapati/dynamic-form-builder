// src/hooks/useResponsive.ts
import { useMediaQuery, useTheme } from "@mui/material";

export function useResponsive() {
    const theme = useTheme();

    return {
        isMobile: useMediaQuery(theme.breakpoints.down("sm")),
        isTablet: useMediaQuery(theme.breakpoints.between("sm", "md")),
        isDesktop: useMediaQuery(theme.breakpoints.up("md")),
        isLargeDesktop: useMediaQuery(theme.breakpoints.up("lg")),
    };
}
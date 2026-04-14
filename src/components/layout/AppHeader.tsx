// src/components/layout/AppHeader.tsx (updated with new colors)
import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuRounded";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./UserMenu";
import { NavigationDrawer } from "./NavigationDrawer";
import { useI18n } from "@/hooks/useI18n";
import { useResponsive } from "@/hooks/useResponsive";
import { colorTokens, extendedPalette } from "@/theme/palette";
import { useUiStore } from "@/store/uiStore";

export function AppHeader() {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;
  const { isMobile } = useResponsive();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => setDrawerOpen((p) => !p), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const role = useUiStore((s) => s.role);
  const isAdmin = role === "admin";
  const navLinks = [
    {
      label: t("userDashboard"),
      path: "/forms",
      icon: <DashboardIcon sx={{ fontSize: 18 }} />,
    },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: ext.header.bg,
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${ext.header.border}`,
        }}
      >
        <Toolbar
          sx={{
            gap: 1,
            px: { xs: 1.5, sm: 2, md: 3 },
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Mobile Menu */}
          {isMobile && (
            <IconButton
              onClick={toggleDrawer}
              edge="start"
              aria-label="Menu"
              sx={{
                mr: 0.5,
                borderRadius: 1.5,
                border: `1px solid ${ext.border.light}`,
                width: 40,
                height: 40,
                color: "text.primary",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  bgcolor: ext.accent.primarySoft,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Logo collapsed={isMobile} />

          {/* Desktop Nav Pill */}
          {!isMobile && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                ml: 4,
                bgcolor: isDark
                  ? "rgba(148, 163, 184, 0.06)"
                  : "rgba(76, 110, 245, 0.04)",
                borderRadius: 1.5,
                p: 0.5,
                border: `1px solid ${ext.border.light}`,
              }}
            >
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    startIcon={link.icon}
                    size="small"
                    sx={{
                      px: 2,
                      py: 0.75,
                      borderRadius: 1.5,
                      fontSize: "0.8125rem",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive
                        ? "#FFFFFF"
                        : "text.secondary",
                      background: isActive
                        ? colorTokens.gradients.accent
                        : "transparent",
                      boxShadow: isActive
                        ? `0 2px 8px ${colorTokens.ocean[500]}30`
                        : "none",
                      "&:hover": {
                        background: isActive
                          ? colorTokens.gradients.accent
                          : ext.accent.primarySoft,
                        color: isActive ? "#FFFFFF" : "text.primary",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Stack>
          )}

          <Box sx={{ flex: 1 }} />

          {/* CTA Button */}
          {!isMobile && isAdmin && (
            <Button
              component={Link}
              to="/forms/new"
              variant="contained"
              size="small"
              startIcon={<AddCircleOutlineIcon sx={{ fontSize: 18 }} />}
              sx={{
                mr: 1.5,
                px: 2.5,
                py: 0.85,
                borderRadius: 1.5,
                fontSize: "0.8125rem",
                fontWeight: 600,
                background: colorTokens.gradients.accent,
                boxShadow: `0 2px 12px ${colorTokens.teal[500]}30`,
                "&:hover": {
                  background: colorTokens.gradients.accent,
                  transform: "translateY(-1px)",
                  boxShadow: `0 6px 20px ${colorTokens.teal[500]}40`,
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              New Form
            </Button>
          )}

          {/* Controls */}
          <Stack direction="row" spacing={1} alignItems="center">
            {!isMobile && <LanguageSwitcher />}
            <ThemeToggle />
            <UserMenu />
          </Stack>
        </Toolbar>
      </AppBar>

      <NavigationDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
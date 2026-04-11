import { useCallback } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { useUiStore } from "@/store/uiStore";
import { useI18n } from "@/hooks/useI18n";
import type { AppLocale, UserRole } from "@/types/form";

export function AppLayout() {
  const { t, locale, setLocale } = useI18n();
  const mode = useUiStore((s) => s.mode);
  const toggleMode = useUiStore((s) => s.toggleMode);
  const role = useUiStore((s) => s.role);
  const setRole = useUiStore((s) => s.setRole);
  const onRole = useCallback(
    (r: UserRole) => {
      setRole(r);
    },
    [setRole]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700 }}
            component={Link}
            to="/"
            color="inherit"
            style={{ textDecoration: "none" }}
          >
            {t("appTitle")}
          </Typography>
          <Button component={Link} to="/forms" color="inherit" size="small" sx={{ mr: 1 }}>
            {t("userDashboard")}
          </Button>
          <FormControl size="small" sx={{ minWidth: 110, mr: 1 }}>
            <Select
              value={role}
              onChange={(e) => onRole(e.target.value as UserRole)}
              displayEmpty
              aria-label="Role"
            >
              <MenuItem value="admin">
                <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 18, verticalAlign: "middle" }} />
                {t("roleAdmin")}
              </MenuItem>
              <MenuItem value="user">
                <PersonIcon sx={{ mr: 1, fontSize: 18, verticalAlign: "middle" }} />
                {t("roleUser")}
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100, mr: 1 }}>
            <Select
              value={locale}
              onChange={(e) => setLocale(e.target.value as AppLocale)}
              aria-label={t("language")}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title={t("darkMode")}>
            <IconButton onClick={toggleMode} color="inherit" aria-label={t("darkMode")}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

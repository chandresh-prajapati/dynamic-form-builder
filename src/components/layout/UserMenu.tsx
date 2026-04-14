// src/components/layout/UserMenu.tsx
import { useState, useCallback } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckIcon from "@mui/icons-material/Check";
import { useUiStore } from "@/store/uiStore";
import { useI18n } from "@/hooks/useI18n";
import type { UserRole } from "@/types/form";

const ROLES: { value: UserRole; icon: typeof PersonIcon; color: string }[] = [
  { value: "admin", icon: AdminPanelSettingsIcon, color: "#EF4444" },
  { value: "user", icon: PersonIcon, color: "#3B82F6" },
];

export function UserMenu() {
  const { t } = useI18n();
  const theme = useTheme();
  const role = useUiStore((s) => s.role);
  const setRole = useUiStore((s) => s.setRole);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleRoleChange = useCallback(
    (newRole: UserRole) => {
      setRole(newRole);
      handleClose();
    },
    [setRole, handleClose]
  );

  const currentRole = ROLES.find((r) => r.value === role)!;
  const RoleIcon = currentRole.icon;

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="User menu"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          p: 0.5,
          border: "2px solid",
          borderColor: open ? "primary.main" : "divider",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
          },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: currentRole.color,
            fontSize: "0.875rem",
            fontWeight: 700,
          }}
        >
          <RoleIcon sx={{ fontSize: 18 }} />
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1.5,
              minWidth: 240,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0,0,0,0.5)"
                  : "0 8px 32px rgba(0,0,0,0.08)",
              overflow: "visible",
              // Arrow
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 16,
                width: 12,
                height: 12,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                borderLeft: "1px solid",
                borderTop: "1px solid",
                borderColor: "divider",
              },
            },
          },
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Demo User
          </Typography>
          <Typography variant="caption" color="text.secondary">
            demo@formbuilder.app
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<RoleIcon sx={{ fontSize: "14px !important" }} />}
              label={role === "admin" ? t("roleAdmin") : t("roleUser")}
              size="small"
              sx={{
                bgcolor: `${currentRole.color}20`,
                color: currentRole.color,
                fontWeight: 600,
                fontSize: "0.7rem",
                height: 24,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Role Switching Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: 1 }}
          >
            <SwapHorizIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
            Switch Role
          </Typography>
        </Box>

        {ROLES.map((r) => {
          const Icon = r.icon;
          return (
            <MenuItem
              key={r.value}
              onClick={() => handleRoleChange(r.value)}
              selected={role === r.value}
              sx={{
                mx: 1,
                borderRadius: 1.5,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: `${r.color}15`,
                  "&:hover": {
                    bgcolor: `${r.color}25`,
                  },
                },
              }}
            >
              <ListItemIcon>
                <Icon sx={{ color: r.color, fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  r.value === "admin" ? t("roleAdmin") : t("roleUser")
                }
                primaryTypographyProps={{
                  fontSize: "0.8125rem",
                  fontWeight: role === r.value ? 600 : 400,
                }}
              />
              {role === r.value && (
                <CheckIcon sx={{ fontSize: 16, color: r.color, ml: 1 }} />
              )}
            </MenuItem>
          );
        })}

        {/* <Divider sx={{ my: 1 }} /> */}

        {/* <MenuItem
          sx={{ mx: 1, borderRadius: 1.5, mb: 0.5 }}
          onClick={handleClose}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{ fontSize: "0.8125rem" }}
          />
        </MenuItem> */}
        {/* 
        <MenuItem
          sx={{ mx: 1, borderRadius: 1.5, mb: 1, color: "error.main" }}
          onClick={handleClose}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{ fontSize: "0.8125rem" }}
          />
        </MenuItem> */}
      </Menu>
    </>
  );
}
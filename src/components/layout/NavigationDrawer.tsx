import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { useI18n } from "@/hooks/useI18n";

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
  const { t } = useI18n();
  const location = useLocation();

  const navItems = [
    {
      label: t("userDashboard"),
      path: "/forms",
      icon: <DashboardIcon />,
    },
    {
      label: "Create Form",
      path: "/forms/new",
      icon: <AddCircleIcon />,
    },
    {
      label: "Responses",
      path: "/responses",
      icon: <BarChartIcon />,
    },
    {
      label: "Templates",
      path: "/templates",
      icon: <DescriptionIcon />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          borderRadius: "0 16px 16px 0",
          border: "none",
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 2,
        }}
      >
        <Logo />
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        <Typography
          variant="overline"
          sx={{
            px: 1.5,
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "text.secondary",
            letterSpacing: 1.5,
          }}
        >
          Navigation
        </Typography>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5, mt: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onClose}
                sx={{
                  borderRadius: 1.5,
                  py: 1.2,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    bgcolor: isActive ? "primary.dark" : "action.hover",
                  },
                  "& .MuiListItemIcon-root": {
                    color: isActive ? "primary.contrastText" : "text.secondary",
                    minWidth: 40,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Section */}
      <Box
        sx={{
          p: 2,
          mx: 1.5,
          mb: 2,
          borderRadius: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          Need Help?
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 0.5 }}>
          Check our docs for guides and tutorials
        </Typography>
      </Box>
    </Drawer>
  );
}
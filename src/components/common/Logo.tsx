// src/components/common/Logo.tsx (updated with new palette)
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import { colorTokens } from "@/theme/palette";

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed = false }: LogoProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        textDecoration: "none",
        color: "inherit",
        "&:hover .logo-icon": {
          transform: "rotate(-8deg) scale(1.08)",
          boxShadow: `0 4px 20px ${colorTokens.ocean[500]}50`,
        },
      }}
    >
      <Box
        className="logo-icon"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: 1.5,
          background: colorTokens.gradients.accent,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: `0 2px 8px ${colorTokens.ocean[500]}30`,
        }}
      >
        <DynamicFormIcon sx={{ color: "#fff", fontSize: 22 }} />
      </Box>
      {!collapsed && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1.15rem",
              lineHeight: 1.2,
              background: isDark
                ? `linear-gradient(135deg, ${colorTokens.ocean[300]}, ${colorTokens.teal[300]})`
                : colorTokens.gradients.accent,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
            }}
          >
            FormBuilder
          </Typography>
          <Typography
            sx={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: "text.secondary",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1,
              mt: 0.2,
            }}
          >
            Pro Edition
          </Typography>
        </Box>
      )}
    </Box>
  );
}
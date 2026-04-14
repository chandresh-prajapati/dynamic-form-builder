// src/components/layout/ThemeToggle.tsx
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import { useUiStore } from "@/store/uiStore";
import { useI18n } from "@/hooks/useI18n";

export function ThemeToggle() {
  const { t } = useI18n();
  const mode = useUiStore((s) => s.mode);
  const toggleMode = useUiStore((s) => s.toggleMode);
  const theme = useTheme();

  return (
    <Tooltip title={mode === "dark" ? t("lightMode") : t("darkMode")} arrow>
      <IconButton
        onClick={toggleMode}
        aria-label={t("darkMode")}
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "text.primary",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.04)",
            borderColor: "primary.main",
            color: "primary.main",
          },
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            {mode === "dark" ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </motion.div>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
}
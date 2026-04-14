import { Alert, Snackbar, useTheme } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { colorTokens } from "@/theme/palette";

type SnackSeverity = "success" | "error" | "info" | "warning";

interface AppSnackbarProps {
  message: string | null;
  severity?: SnackSeverity;
  onClose: () => void;
}

function getSeverity(message: string): SnackSeverity {
  if (message.toLowerCase().includes("fail") || message.toLowerCase().includes("invalid"))
    return "error";
  if (message.toLowerCase().includes("saved") || message.toLowerCase().includes("import"))
    return "success";
  return "info";
}

export function AppSnackbar({
  message,
  severity,
  onClose,
}: AppSnackbarProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const resolvedSeverity = severity ?? (message ? getSeverity(message) : "info");

  const iconMap = {
    success: <CheckCircleRoundedIcon fontSize="small" />,
    error: <ErrorRoundedIcon fontSize="small" />,
    info: <InfoRoundedIcon fontSize="small" />,
    warning: <InfoRoundedIcon fontSize="small" />,
  };

  const colorMap = {
    success: {
      bg: isDark ? colorTokens.status.success.bgDark : colorTokens.status.success.bg,
      color: isDark ? colorTokens.status.success.light : colorTokens.status.success.dark,
      border: `${colorTokens.status.success.main}30`,
    },
    error: {
      bg: isDark ? colorTokens.status.error.bgDark : colorTokens.status.error.bg,
      color: isDark ? colorTokens.status.error.light : colorTokens.status.error.dark,
      border: `${colorTokens.status.error.main}30`,
    },
    info: {
      bg: isDark ? colorTokens.status.info.bgDark : colorTokens.status.info.bg,
      color: isDark ? colorTokens.status.info.light : colorTokens.status.info.dark,
      border: `${colorTokens.status.info.main}30`,
    },
    warning: {
      bg: isDark ? colorTokens.status.warning.bgDark : colorTokens.status.warning.bg,
      color: isDark ? colorTokens.status.warning.light : colorTokens.status.warning.dark,
      border: `${colorTokens.status.warning.main}30`,
    },
  };

  const c = colorMap[resolvedSeverity];

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={resolvedSeverity}
        icon={iconMap[resolvedSeverity]}
        onClose={onClose}
        sx={{
          borderRadius: 1,
          border: `1px solid ${c.border}`,
          bgcolor: c.bg,
          color: c.color,
          fontWeight: 600,
          fontSize: "0.875rem",
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.12)",
          "& .MuiAlert-icon": { color: "inherit" },
          "& .MuiAlert-action": { color: "inherit" },
          minWidth: 280,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
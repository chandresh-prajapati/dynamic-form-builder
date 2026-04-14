import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useI18n } from "@/hooks/useI18n";
import { colorTokens, extendedPalette } from "@/theme/palette";

// ─────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────
interface ConfirmDeleteDialogProps {
  open: boolean;
  /** Optional field/item name to display in the message */
  itemName?: string;
  /** Show loading spinner on confirm button */
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
export function ConfirmDeleteDialog({
  open,
  itemName,
  isPending = false,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      // Prevent closing by clicking backdrop when pending
      disableEscapeKeyDown={isPending}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 1,
          border: `1px solid ${ext.border.light}`,
          overflow: "hidden",
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.6)"
            : "0 24px 64px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* ── Gradient Danger Bar at top ──────────────────── */}
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, 
            ${colorTokens.status.error.main}, 
            ${colorTokens.coral[400]}
          )`,
        }}
      />

      {/* ── Icon + Title ────────────────────────────────── */}
      <DialogTitle sx={{ pb: 0, pt: 3, px: 3 }}>
        <Stack alignItems="center" spacing={2}>
          {/* Animated Warning Icon Box */}
          <Box
            sx={{
              position: "relative",
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Pulsing outer ring */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                bgcolor: isDark
                  ? colorTokens.status.error.bgDark
                  : colorTokens.status.error.bg,
                animation: "pulseRing 2s ease-in-out infinite",
                "@keyframes pulseRing": {
                  "0%, 100%": {
                    transform: "scale(1)",
                    opacity: 0.6,
                  },
                  "50%": {
                    transform: "scale(1.1)",
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Icon container */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: isDark
                  ? colorTokens.status.error.bgDark
                  : colorTokens.status.error.bg,
                border: `2px solid ${colorTokens.status.error.main}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 16px ${colorTokens.status.error.main}25`,
              }}
            >
              <WarningAmberRoundedIcon
                sx={{
                  fontSize: 28,
                  color: colorTokens.status.error.main,
                  animation: "shake 0.5s ease-in-out 0.3s both",
                  "@keyframes shake": {
                    "0%, 100%": { transform: "rotate(0deg)" },
                    "20%": { transform: "rotate(-8deg)" },
                    "40%": { transform: "rotate(8deg)" },
                    "60%": { transform: "rotate(-5deg)" },
                    "80%": { transform: "rotate(5deg)" },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Title text */}
          <Typography
            variant="h6"
            fontWeight={800}
            textAlign="center"
            sx={{
              letterSpacing: "-0.02em",
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {t("confirmDelete")}
          </Typography>
        </Stack>
      </DialogTitle>

      {/* ── Content ─────────────────────────────────────── */}
      <DialogContent sx={{ px: 3, pt: 2, pb: 0 }}>
        <Stack spacing={2}>
          {/* Main description */}
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ lineHeight: 1.7, fontSize: "0.875rem" }}
          >
            {itemName ? (
              <>
                You're about to permanently delete{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(0,0,0,0.05)",
                    px: 0.75,
                    py: 0.15,
                    borderRadius: 1,
                    fontFamily: "monospace",
                    fontSize: "0.85em",
                  }}
                >
                  {itemName}
                </Box>
                .
              </>
            ) : (
              "You're about to permanently delete this item."
            )}
          </Typography>

          {/* Warning notice box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.25,
              p: 1.75,
              borderRadius: 1,
              bgcolor: isDark
                ? colorTokens.status.error.bgDark
                : colorTokens.status.error.bg,
              border: `1px solid ${colorTokens.status.error.main}20`,
            }}
          >
            <Box
              sx={{
                width: 4,
                alignSelf: "stretch",
                borderRadius: 1,
                bgcolor: colorTokens.status.error.main,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? colorTokens.status.error.light
                  : colorTokens.status.error.dark,
                fontWeight: 500,
                lineHeight: 1.6,
                fontSize: "0.78rem",
              }}
            >
              This action{" "}
              <Box component="span" sx={{ fontWeight: 800 }}>
                cannot be undone.
              </Box>{" "}
              All associated data will be permanently removed from our
              servers.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <Divider sx={{ mt: 3, borderColor: ext.border.light }} />

      {/* ── Actions ─────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          gap: 1.5,
          // Stack on mobile, row on desktop
          flexDirection: { xs: "column-reverse", sm: "row" },
          "& > *": { m: "0 !important" },
        }}
      >
        {/* Cancel */}
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          disabled={isPending}
          startIcon={<CloseRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 1,
            fontWeight: 600,
            py: 1,
            borderWidth: "1.5px",
            borderColor: ext.border.main,
            color: "text.secondary",
            "&:hover": {
              borderWidth: "1.5px",
              borderColor: ext.border.focus,
              bgcolor: ext.accent.primarySoft,
              color: isDark ? colorTokens.ocean[300] : colorTokens.ocean[700],
            },
            "&.Mui-disabled": { opacity: 0.5 },
          }}
        >
          {t("cancel")}
        </Button>

        {/* Confirm Delete */}
        <Button
          fullWidth
          variant="contained"
          onClick={onConfirm}
          disabled={isPending}
          startIcon={
            isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteForeverRoundedIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            borderRadius: 1,
            fontWeight: 700,
            py: 1,
            bgcolor: colorTokens.status.error.main,
            color: "#fff",
            boxShadow: `0 4px 16px ${colorTokens.status.error.main}35`,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: colorTokens.status.error.dark,
              transform: "translateY(-1px)",
              boxShadow: `0 8px 24px ${colorTokens.status.error.main}45`,
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: `0 2px 8px ${colorTokens.status.error.main}35`,
            },
            "&.Mui-disabled": {
              bgcolor: colorTokens.status.error.main,
              color: "rgba(255,255,255,0.7)",
              opacity: 0.8,
            },
          }}
        >
          {isPending ? "Deleting…" : t("delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
import { memo, useMemo } from "react";
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";
import { colorTokens, extendedPalette } from "@/theme/palette";
import type { FormField, FormSubmissionRecord } from "@/types/form";

export const ResponsesTable = memo(function ResponsesTable({
  fields,
  rows,
}: {
  fields: FormField[];
  rows: FormSubmissionRecord[];
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const keys = useMemo(() => fields.map((f) => f.id), [fields]);
  const labels = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.id, f.label])),
    [fields]
  );

  if (rows.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No responses yet.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        width: "100%",
        overflowX: "auto",
        bgcolor: "transparent",
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                minWidth: 180,
                bgcolor: isDark ? colorTokens.slate[900] : colorTokens.slate[50],
                borderBottom: `1px solid ${ext.border.light}`,
                fontWeight: 700,
                color: "text.secondary",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <AccessTimeRoundedIcon sx={{ fontSize: 15 }} />
                Submitted
              </Box>
            </TableCell>

            {keys.map((k) => (
              <TableCell
                key={k}
                sx={{
                  minWidth: 160,
                  bgcolor: isDark ? colorTokens.slate[900] : colorTokens.slate[50],
                  borderBottom: `1px solid ${ext.border.light}`,
                  fontWeight: 700,
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {labels[k] ?? k}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r, rowIndex) => (
            <TableRow
              key={r.id}
              hover
              sx={{
                transition: "background-color 0.2s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(76,110,245,0.03)",
                },
                "& td": {
                  borderBottom:
                    rowIndex === rows.length - 1
                      ? "none"
                      : `1px solid ${ext.border.light}`,
                },
              }}
            >
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  fontSize: "0.8125rem",
                  color: "text.secondary",
                  verticalAlign: "top",
                }}
              >
                {new Date(r.submittedAt).toLocaleString()}
              </TableCell>

              {keys.map((k) => (
                <TableCell
                  key={k}
                  sx={{
                    verticalAlign: "top",
                    fontSize: "0.8125rem",
                    color: "text.primary",
                  }}
                >
                  <CellValue value={r.data[k]} isDark={isDark} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

function CellValue({
  value,
  isDark,
}: {
  value: unknown;
  isDark: boolean;
}) {
  if (value === null || value === undefined || value === "") {
    return (
      <Typography variant="caption" color="text.disabled">
        —
      </Typography>
    );
  }

  if (typeof value === "boolean") {
    return value ? (
      <Chip
        icon={<CheckCircleRoundedIcon sx={{ fontSize: "14px !important" }} />}
        label="Yes"
        size="small"
        sx={{
          height: 22,
          fontSize: "0.68rem",
          fontWeight: 700,
          bgcolor: isDark
            ? colorTokens.status.success.bgDark
            : colorTokens.status.success.bg,
          color: isDark
            ? colorTokens.status.success.light
            : colorTokens.status.success.dark,
          "& .MuiChip-icon": { color: "inherit" },
        }}
      />
    ) : (
      <Chip
        icon={<CancelRoundedIcon sx={{ fontSize: "14px !important" }} />}
        label="No"
        size="small"
        sx={{
          height: 22,
          fontSize: "0.68rem",
          fontWeight: 700,
          bgcolor: isDark
            ? colorTokens.status.error.bgDark
            : colorTokens.status.error.bg,
          color: isDark
            ? colorTokens.status.error.light
            : colorTokens.status.error.dark,
          "& .MuiChip-icon": { color: "inherit" },
        }}
      />
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <Typography variant="caption" color="text.disabled">
          —
        </Typography>
      );
    }

    const looksLikeFiles =
      value[0] instanceof File ||
      (typeof value[0] === "object" && value[0] !== null && "name" in value[0]);

    if (looksLikeFiles) {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {value.map((file: any, i: number) => {
            if (file.previewUrl) {
              return (
                <Box
                  key={i}
                  title={file.name}
                  sx={{
                    position: "relative",
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={file.previewUrl}
                    alt={file.name || `Image preview`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              );
            }

            return (
              <Chip
                key={i}
                icon={<AttachFileRoundedIcon sx={{ fontSize: "14px !important" }} />}
                label={file.name || `File ${i + 1}`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                }}
              />
            );
          })}
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {value.slice(0, 3).map((item, i) => (
          <Chip
            key={i}
            label={String(item)}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.68rem",
              fontWeight: 600,
            }}
          />
        ))}
        {value.length > 3 && (
          <Chip
            label={`+${value.length - 3}`}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.68rem",
              fontWeight: 700,
            }}
          />
        )}
      </Box>
    );
  }

  if (typeof value === "object") {
    return (
      <Chip
        icon={<DataObjectRoundedIcon sx={{ fontSize: "14px !important" }} />}
        label="Object"
        size="small"
        sx={{
          height: 22,
          fontSize: "0.68rem",
          fontWeight: 700,
        }}
      />
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{
        fontSize: "0.8125rem",
        lineHeight: 1.5,
        wordBreak: "break-word",
      }}
    >
      {String(value)}
    </Typography>
  );
}
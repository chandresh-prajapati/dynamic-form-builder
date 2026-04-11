import { memo, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { FormField, FormSubmissionRecord } from "@/types/form";

export const ResponsesTable = memo(function ResponsesTable({
  fields,
  rows,
}: {
  fields: FormField[];
  rows: FormSubmissionRecord[];
}) {
  const keys = useMemo(() => fields.map((f) => f.id), [fields]);
  const labels = useMemo(() => Object.fromEntries(fields.map((f) => [f.id, f.label])), [fields]);

  if (rows.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ p: 2 }}>
        No responses yet.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Submitted</TableCell>
            {keys.map((k) => (
              <TableCell key={k}>{labels[k] ?? k}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{new Date(r.submittedAt).toLocaleString()}</TableCell>
              {keys.map((k) => (
                <TableCell key={k}>{formatCell(r.data[k])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

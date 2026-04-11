import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { UserFormsPage } from "@/pages/UserFormsPage";
import { FillFormPage } from "@/pages/FillFormPage";
import { useUiStore } from "@/store/uiStore";

function HomeRoute() {
  const role = useUiStore((s) => s.role);
  return role === "admin" ? <DashboardPage /> : <UserFormsPage />;
}

export default function App() {
  const mode = useUiStore((s) => s.mode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#90caf9" : "#1976d2" },
        },
        shape: { borderRadius: 10 },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/forms" element={<UserFormsPage />} />
            <Route path="/fill/:formId" element={<FillFormPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

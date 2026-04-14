import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export function AppLayout() {

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
        transition: "background-color 0.3s ease",
      }}
    >
      <AppHeader />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Container>

      {/* Optional Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          textAlign: "center",
          fontSize: "0.75rem",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        © {new Date().getFullYear()} FormBuilder. Built with MUI.
      </Box>
    </Box>
  );
}
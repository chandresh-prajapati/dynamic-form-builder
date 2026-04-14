// src/components/layout/LanguageSwitcher.tsx
import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useI18n } from "@/hooks/useI18n";
import type { AppLocale } from "@/types/form";

const LANGUAGES: { code: AppLocale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        p: 0.5,
        bgcolor: "background.paper",
      }}
    >
      <TranslateIcon
        sx={{ fontSize: 16, color: "text.secondary", ml: 0.5 }}
      />
      {LANGUAGES.map((lang) => (
        <Tooltip key={lang.code} title={lang.label} arrow>
          <ButtonBase
            onClick={() => setLocale(lang.code)}
            aria-label={lang.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 1.5,
              fontSize: "0.8125rem",
              fontWeight: locale === lang.code ? 700 : 400,
              bgcolor:
                locale === lang.code
                  ? "primary.main"
                  : "transparent",
              color:
                locale === lang.code
                  ? "primary.contrastText"
                  : "text.secondary",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor:
                  locale === lang.code
                    ? "primary.dark"
                    : "action.hover",
              },
            }}
          >
            <Typography component="span" sx={{ fontSize: "1rem", lineHeight: 1 }}>
              {lang.flag}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: "0.75rem",
                fontWeight: "inherit",
                display: { xs: "none", sm: "inline" },
              }}
            >
              {lang.code.toUpperCase()}
            </Typography>
          </ButtonBase>
        </Tooltip>
      ))}
    </Box>
  );
}
import { SyntheticEvent } from "react";
import { Box, Tab, Tabs, useTheme, Badge } from "@mui/material";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import { colorTokens, extendedPalette } from "@/theme/palette";
import { useI18n } from "@/hooks/useI18n";

type TabKey = "builder" | "preview" | "responses";

interface DashboardTabsProps {
  value: TabKey;
  onChange: (v: TabKey) => void;
  fieldCount: number;
  responseCount: number;
}

export function DashboardTabs({
  value,
  onChange,
  fieldCount,
  responseCount,
}: DashboardTabsProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ext = isDark ? extendedPalette.dark : extendedPalette.light;

  const tabs: {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
      {
        key: "builder",
        label: t("builder"),
        icon: <BuildRoundedIcon sx={{ fontSize: 18 }} />,
        badge: fieldCount,
      },
      {
        key: "preview",
        label: t("preview"),
        icon: <VisibilityRoundedIcon sx={{ fontSize: 18 }} />,
      },
      {
        key: "responses",
        label: t("responses"),
        icon: <BarChartRoundedIcon sx={{ fontSize: 18 }} />,
        badge: responseCount,
      },
    ];

  return (
    <Box
      sx={{
        mb: 3,
        p: 0.5,
        borderRadius: 1,
        bgcolor: isDark
          ? "rgba(148, 163, 184, 0.06)"
          : "rgba(76, 110, 245, 0.04)",
        border: `1px solid ${ext.border.light}`,
        display: "inline-flex",
        width: "100%",
      }}
    >
      <Tabs
        value={value}
        onChange={(_: SyntheticEvent, v: TabKey) => onChange(v)}
        variant="fullWidth"
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          width: "100%",
          minHeight: 44,
          "& .MuiTabs-flexContainer": { gap: 0.5 },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            value={tab.key}
            disableRipple
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  position: "relative",
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <Badge
                    badgeContent={tab.badge}
                    sx={{
                      "& .MuiBadge-badge": {
                        position: "static",
                        transform: "none",
                        fontSize: "0.6rem",
                        height: 18,
                        minWidth: 18,
                        borderRadius: "9px",
                        fontWeight: 700,
                        bgcolor:
                          value === tab.key
                            ? "rgba(255,255,255,0.25)"
                            : ext.accent.primarySoft,
                        color:
                          value === tab.key
                            ? "#fff"
                            : isDark
                              ? colorTokens.ocean[300]
                              : colorTokens.ocean[700],
                      },
                    }}
                  />
                )}
              </Box>
            }
            sx={{
              minHeight: 44,
              borderRadius: 1,
              textTransform: "none",
              fontSize: "0.8125rem",
              fontWeight: value === tab.key ? 700 : 500,
              color:
                value === tab.key
                  ? "#FFFFFF !important"
                  : "text.secondary",
              background:
                value === tab.key
                  ? colorTokens.gradients.accent
                  : "transparent",
              boxShadow:
                value === tab.key
                  ? `0 2px 8px ${colorTokens.ocean[500]}30`
                  : "none",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor:
                  value === tab.key
                    ? undefined
                    : ext.accent.primarySoft,
                color:
                  value === tab.key
                    ? "#FFFFFF !important"
                    : `${isDark ? colorTokens.ocean[300] : colorTokens.ocean[700]} !important`,
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
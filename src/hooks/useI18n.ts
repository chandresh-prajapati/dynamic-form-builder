import { useMemo } from "react";
import { useUiStore } from "@/store/uiStore";
import type { AppLocale } from "@/types/form";
import { messages } from "@/i18n/messages";

export function useI18n() {
  const locale = useUiStore((s) => s.locale);
  const setLocale = useUiStore((s) => s.setLocale);

  const t = useMemo(() => {
    const table = messages[locale] ?? messages.en;
    return (key: keyof typeof messages.en) => table[key] ?? messages.en[key];
  }, [locale]);

  return { t, locale, setLocale: setLocale as (l: AppLocale) => void };
}

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppLocale, UserRole } from "@/types/form";

interface UiState {
  mode: "light" | "dark";
  role: UserRole;
  locale: AppLocale;
  setMode: (mode: "light" | "dark") => void;
  toggleMode: () => void;
  setRole: (role: UserRole) => void;
  setLocale: (locale: AppLocale) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      mode: "light",
      role: "admin",
      locale: "en",
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === "light" ? "dark" : "light" }),
      setRole: (role) => set({ role }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "form-builder-ui",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

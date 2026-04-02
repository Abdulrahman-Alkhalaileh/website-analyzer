import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

type ThemeModeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

export const useThemeModeStore = create<ThemeModeState>()(
  persist(
    (set, get) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === "dark" ? "light" : "dark" }),
    }),
    {
      name: "website-analyzer-theme",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (rehydrated) => {
        if (rehydrated && typeof document !== "undefined") {
          document.documentElement.dataset.theme = rehydrated.mode;
        }
      },
    }
  )
);

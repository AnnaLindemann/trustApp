// src/stores/useAppStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
        }),
    }),
    {
      name: "trustjar-app-v1",
    },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DELTA_TRUTH = 5;
export const DELTA_LIE = -10;
export const DELTA_REPAIR = 3;

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));

type State = {
  trustScore: number;
};

type Actions = {
  truth: () => void;
  lie: () => void;
  repair: () => void;
};

export const useTrustStore = create<State & Actions>()(
  persist(
    (set) => ({
      trustScore: 50,

      truth: () =>
        set((s: State) => ({ trustScore: clamp(s.trustScore + DELTA_TRUTH) })),

      lie: () =>
        set((s: State) => ({ trustScore: clamp(s.trustScore + DELTA_LIE) })),

      repair: () =>
        set((s: State) => ({ trustScore: clamp(s.trustScore + DELTA_REPAIR) })),
    }),
    {
      name: "trust-app:state",

      partialize: (state) => ({ trustScore: state.trustScore }),
      version: 1,
    }
  )
);


import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Child = {
  id: string;
  name: string;
  photoUrl?: string | null;   
  trustScore: number;       
  createdAt: number;
};

type State = {
  children: Child[];
  activeChildId: string | null;
};

type Actions = {
  addChild: (p: { name: string; photoUrl?: string | null }) => string;
  setActiveChild: (id: string | null) => void;
  removeChild: (id: string) => void;
  renameChild: (id: string, name: string) => void;
  setPhoto: (id: string, photoUrl: string | null) => void;

  truthActive: () => void;  
  lieActive: () => void;     
  repairActive: () => void;  
};

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));

export const useChildrenStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      children: [],
      activeChildId: null,

      addChild: ({ name, photoUrl }) => {
        const id = crypto.randomUUID();
        const child: Child = {
          id,
          name: name.trim() || "Unnamed",
          photoUrl: photoUrl ?? null,
          trustScore: 100,         
          createdAt: Date.now(),
        };
        set({ children: [...get().children, child] });
        if (!get().activeChildId) set({ activeChildId: id });
        return id;
      },

      setActiveChild: (id) => set({ activeChildId: id }),

      removeChild: (id) => {
        const next = get().children.filter((c) => c.id !== id);
        const wasActive = get().activeChildId === id;
        set({
          children: next,
          activeChildId: wasActive ? (next[0]?.id ?? null) : get().activeChildId,
        });
      },

      renameChild: (id, name) => {
        set({
          children: get().children.map((c) =>
            c.id === id ? { ...c, name: name.trim() || c.name } : c
          ),
        });
      },

      setPhoto: (id, photoUrl) => {
        set({
          children: get().children.map((c) =>
            c.id === id ? { ...c, photoUrl } : c
          ),
        });
      },

      truthActive: () => {
        const id = get().activeChildId;
        if (!id) return;
        set({
          children: get().children.map((c) =>
            c.id === id ? { ...c, trustScore: clamp(c.trustScore + 5) } : c
          ),
        });
      },
      lieActive: () => {
        const id = get().activeChildId;
        if (!id) return;
        set({
          children: get().children.map((c) =>
            c.id === id ? { ...c, trustScore: clamp(c.trustScore - 10) } : c
          ),
        });
      },
      repairActive: () => {
        const id = get().activeChildId;
        if (!id) return;
        set({
          children: get().children.map((c) =>
            c.id === id ? { ...c, trustScore: clamp(c.trustScore + 3) } : c
          ),
        });
      },
    }),
    { name: "trustjar-children-v1" }
  )
);

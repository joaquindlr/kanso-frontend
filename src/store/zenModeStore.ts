import { create } from 'zustand';

interface ZenModeState {
  isZenMode: boolean;
  toggleZenMode: () => void;
  setZenMode: (isZen: boolean) => void;
}

export const useZenModeStore = create<ZenModeState>((set) => ({
  isZenMode: false,
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
  setZenMode: (isZen) => set({ isZenMode: isZen }),
}));

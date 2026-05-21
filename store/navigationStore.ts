import { create } from "zustand";

interface NavigationState {
  navigatedFromHome: boolean;
  setNavigatedFromHome: (value: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  navigatedFromHome: false,
  setNavigatedFromHome: (value) => set({ navigatedFromHome: value }),
}));

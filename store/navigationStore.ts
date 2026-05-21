import { create } from "zustand";

export type PageTransitionType =
  | "home-to-project"
  | "project-to-home"
  | "project-to-project"
  | "resume-to-home"
  | null;

interface NavigationState {
  navigatedFromHome: boolean;
  setNavigatedFromHome: (value: boolean) => void;
  navigatedFromResume: boolean;
  setNavigatedFromResume: (value: boolean) => void;
  pendingTransition: PageTransitionType;
  setPendingTransition: (value: PageTransitionType) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  navigatedFromHome: false,
  setNavigatedFromHome: (value) => set({ navigatedFromHome: value }),
  navigatedFromResume: false,
  setNavigatedFromResume: (value) => set({ navigatedFromResume: value }),
  pendingTransition: null,
  setPendingTransition: (value) => set({ pendingTransition: value }),
}));

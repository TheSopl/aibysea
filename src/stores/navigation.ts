import { create } from 'zustand';

interface NavigationState {
  isDrawerOpen: boolean;
  activeRoute: string;
  previousRoute: string | null;
  scrollPositions: Record<string, number>;
  bottomNavVisible: boolean;
}

interface NavigationActions {
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setActiveRoute: (route: string) => void;
  saveScrollPosition: (route: string, position: number) => void;
  restoreScrollPosition: (route: string) => number;
  hideBottomNav: () => void;
  showBottomNav: () => void;
}

type NavigationStore = NavigationState & NavigationActions;

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial state
  isDrawerOpen: false,
  activeRoute: '/dashboard',
  previousRoute: null,
  scrollPositions: {},
  bottomNavVisible: true,

  // Drawer actions
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  // Route tracking
  setActiveRoute: (route: string) =>
    set((state) => ({
      activeRoute: route,
      previousRoute: state.activeRoute,
    })),

  // Scroll position persistence
  saveScrollPosition: (route: string, position: number) =>
    set((state) => ({
      scrollPositions: {
        ...state.scrollPositions,
        [route]: position,
      },
    })),

  restoreScrollPosition: (route: string) => {
    const state = get();
    return state.scrollPositions[route] ?? 0;
  },

  // Bottom nav visibility
  hideBottomNav: () => set({ bottomNavVisible: false }),
  showBottomNav: () => set({ bottomNavVisible: true }),
}));

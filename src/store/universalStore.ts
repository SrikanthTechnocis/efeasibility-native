import { create } from "zustand";

interface UNIVERSALSTORE {
  headerName: string;
  drawerOpen: boolean;
  fetchUniverseStore: () => void;
  toggleDrawer: () => Promise<any>;
}

export const universalStore = create<UNIVERSALSTORE>((set) => ({
  headerName: "",
  drawerOpen: false,

  toggleDrawer: async () => {
    set((state) => ({ drawerOpen: !state.drawerOpen }));
    return Promise.resolve();
  },

  fetchUniverseStore: () => {
    set({ headerName: "Dashboard" });
  },
}));

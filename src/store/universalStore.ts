import { create } from "zustand";
import axios from "axios";
import axiosHTTP from "../interceptors/axiosInterceptor";
interface UNIVERSALSTORE {
  headerName: string;
  drawerOpen: boolean;
  fetchUniverseStore: () => void;
  toggleDrawer: () => Promise<any>;
  fetchQuestionnaires: (data: any) => Promise<any>;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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

  fetchQuestionnaires: async (userId: any) => {
    try {
      const res = await axiosHTTP.get(
        `${apiUrl}/questionassign/scraandccrareport/${userId}`
      );
      return res;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("--Error: Axios Error--");
        console.log("Message:", error.message);
        console.log("Status Code:", error.response?.status);
      } else {
        console.log("--Error: Non-Axios Error--");
        console.log(error);
      }
      return null;
    }
  },
}));

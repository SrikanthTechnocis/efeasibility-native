import { create } from "zustand";
import axios from "axios";
import axiosHTTP from "../interceptors/axiosInterceptor";
interface UNIVERSALSTORE {
  headerName: string;
  drawerOpen: boolean;
  fetchUniverseStore: () => void;
  setHeaderName: (title: string) => void;
  toggleDrawer: () => Promise<any>;
  fetchQuestionnaires: (data: any) => Promise<any>;
  fetchQuestionnaireById: (
    questionnaireId: any,
    siteId: any,
    resultId: any,
    userId: any,
    roleId: any
  ) => Promise<any>;
  fetchSecureSignedUrl: (payload: { fileUrl: string }) => Promise<any>;
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

  setHeaderName: (title: string) => {
    set({ headerName: title });
  },

  // Fetch All Questionnaire
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
  // Fetch Questionnaire Details
  fetchQuestionnaireById: async (
    questionnaireId: any,
    siteId: any,
    resultId: any,
    userId: any,
    roleId: any
  ) => {
    try {
      const res = await axiosHTTP.get(
        `${apiUrl}/questionassign/pi-report/${questionnaireId}/${siteId}/${resultId}/${userId}/${roleId}`
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

  // Fetch Signed Url
  fetchSecureSignedUrl: async (paylaod: { fileUrl: string }) => {
    try {
      const res = await axiosHTTP.post(
        `${apiUrl}/api/v1/aws/getsignedurl`,
        paylaod,
        {
          headers: {
            "Content-Type": "application/pdf",
            "Access-Control-Allow-Origin": "*",
          },
        }
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

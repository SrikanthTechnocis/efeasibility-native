import { create } from "zustand";
import axios from "axios";
import axiosHTTP from "../interceptors/axiosInterceptor";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AUTHSTORE {
  login: (data: any) => Promise<any>;
  getUserRoles: (data: any) => Promise<any>;
  getUserFromLocalStorage: () => Promise<any>;
  getTokenLocalStorage: () => Promise<any>;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const authStore = create<AUTHSTORE>((set) => ({
  login: async (data: any) => {
    console.log("--Login Data : ", data);

    try {
      const res = await axios.post(`${apiUrl}/auth/login`, data, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      // console.log("--Login Response : ", res.data);
      return res.data;
    } catch (error: any) {
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

  getUserFromLocalStorage: async () => {
    const user = await AsyncStorage.getItem("user");
    // console.log("--User from Local Storage : ", user);
    if (!user) {
      console.log("--User not found in Local Storage--");
      return null;
    }
    return user;
  },

  getTokenLocalStorage: async () => {
    const token = await AsyncStorage.getItem("basicauth");
    console.log("--Token from Local Storage : ", token);
    if (!token) {
      console.log("--Token not found in Local Storage--");
      return null;
    }
    return token;
  },

  getUserRoles: async (data: any) => {
    console.log("getUserRoles,", data);
    try {
      const res = await axiosHTTP.post(`${apiUrl}/auth/role`, data, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
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

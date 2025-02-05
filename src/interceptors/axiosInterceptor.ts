import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const axiosHTTP = axios.create({
  baseURL: API_BASE_URL,
});
axiosHTTP.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("basicauth"); // Fetch token dynamically
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosHTTP;

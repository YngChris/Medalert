import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base URL for the API - you'll need to set this in your environment
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000";

// Log the base URL for debugging
console.log("🌐 API Base URL:", BASE_URL);
console.log("🔍 Environment variable:", process.env.EXPO_PUBLIC_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 Token added to request:", config.url, token.substring(0, 10) + "...");
      } else {
        console.log("⚠️ No token available for request:", config.url);
      }
    } catch (error) {
      console.error("❌ Error in request interceptor:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          await AsyncStorage.setItem("authToken", accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove(["authToken", "refreshToken", "user"]);
        // You might want to navigate to login screen here
      }
    }

    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put("/api/auth/update-profile", profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put("/api/auth/change-password", passwordData);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post("/api/auth/refresh", { refreshToken });
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete("/api/auth/delete-account");
    return response.data;
  },
};

// Token management
export const tokenManager = {
  // Store tokens
  storeTokens: async (accessToken, refreshToken) => {
    await AsyncStorage.multiSet([
      ["authToken", accessToken],
      ["refreshToken", refreshToken],
    ]);
  },

  // Get access token
  getAccessToken: async () => {
    return await AsyncStorage.getItem("authToken");
  },

  // Get refresh token
  getRefreshToken: async () => {
    return await AsyncStorage.getItem("refreshToken");
  },

  // Clear all tokens
  clearTokens: async () => {
    await AsyncStorage.multiRemove(["authToken", "refreshToken", "user"]);
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem("authToken");
    return !!token;
  },
};

// User data management
export const userManager = {
  // Store user data
  storeUser: async (userData) => {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  },

  // Get user data
  getUser: async () => {
    const userData = await AsyncStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  // Update user data
  updateUser: async (userData) => {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  },

  // Clear user data
  clearUser: async () => {
    await AsyncStorage.removeItem("user");
  },
};

export default api;

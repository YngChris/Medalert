import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockAuthAPI, shouldUseMockAPI } from "./mockAuth";

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

// In-memory token cache to bridge timing gaps with AsyncStorage
let inMemoryAccessToken = null;
export const setAccessToken = (token) => {
  inMemoryAccessToken = token || null;
  if (inMemoryAccessToken) {
    api.defaults.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const useToken = token || inMemoryAccessToken;
      if (useToken) {
        config.headers.Authorization = `Bearer ${useToken}`;
        console.log("🔑 Token added to request:", config.url, (useToken.substring ? useToken.substring(0, 10) : String(useToken).slice(0,10)) + "...");
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

// Auth API methods with mock fallback
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for registration");
      return await mockAuthAPI.register(userData);
    }
    
    try {
      const response = await api.post("/api/auth/register", userData);
      const d = response.data || {};
      const payload = d.data || d;
      const accessToken = payload.token || d.accessToken || d.token;
      const refreshToken = payload.refreshToken || d.refreshToken || null;
      const user = payload.user || d.user || null;
      return {
        success: d.success !== undefined ? d.success : true,
        message: d.message,
        accessToken,
        refreshToken,
        user,
        raw: d,
      };
    } catch (error) {
      // Do not fall back to mock unless explicitly enabled by flag (handled above)
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for login");
      return await mockAuthAPI.login(credentials);
    }
    
    try {
      const response = await api.post("/api/auth/login", credentials);
      const d = response.data || {};
      const payload = d.data || d;
      const accessToken = payload.token || d.accessToken || d.token;
      const refreshToken = payload.refreshToken || d.refreshToken || null;
      const user = payload.user || d.user || null;
      return {
        success: d.success !== undefined ? d.success : true,
        message: d.message,
        accessToken,
        refreshToken,
        user,
        raw: d,
      };
    } catch (error) {
      // Do not fall back to mock unless explicitly enabled by flag (handled above)
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for logout");
      return await mockAuthAPI.logout();
    }
    
    try {
      const response = await api.post("/api/auth/logout");
      return response.data;
    } catch (error) {
      // Do not fall back to mock unless explicitly enabled by flag (handled above)
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for profile");
      return await mockAuthAPI.getProfile();
    }
    
    try {
      const response = await api.get("/api/auth/me");
      return response.data;
    } catch (error) {
      // Do not fall back to mock unless explicitly enabled by flag (handled above)
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for profile update");
      return await mockAuthAPI.updateProfile(profileData);
    }
    
    try {
      const response = await api.put("/api/auth/update-profile", profileData);
      return response.data;
    } catch (error) {
      // Do not fall back to mock unless explicitly enabled by flag (handled above)
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for password change");
      return await mockAuthAPI.changePassword(passwordData);
    }
    
    try {
      const response = await api.put("/api/auth/change-password", passwordData);
      return response.data;
    } catch (error) {
      // Do not fall back to mock unless explicitly enabled by flag (handled above)
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Mock API doesn't need token refresh");
      return { accessToken: `mock_refreshed_${Date.now()}` };
    }
    
    const response = await api.post("/api/auth/refresh", { refreshToken });
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for account deletion");
      return await mockAuthAPI.deleteAccount();
    }
    
    try {
      const response = await api.delete("/api/auth/delete-account");
      return response.data;
    } catch (error) {
      console.log("🌐 Backend account deletion failed, falling back to mock API");
      return await mockAuthAPI.deleteAccount();
    }
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

// Reports API methods
export const reportsAPI = {
  // Get all reports for a user (excluding deleted ones by default)
  getReports: async (userId, includeDeleted = false) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for reports");
      // Fallback to AsyncStorage for mock mode
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const jsonValue = await AsyncStorage.getItem('@medalert_reports');
      const allReports = jsonValue != null ? JSON.parse(jsonValue) : [];
      let filteredReports = userId ? allReports.filter(report => report.userId === userId) : allReports;
      
      // Filter out deleted reports unless specifically requested
      if (!includeDeleted) {
        filteredReports = filteredReports.filter(report => report.status !== 'deleted');
      }
      
      return filteredReports;
    }
    
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (includeDeleted) params.append('includeDeleted', 'true');
      
      const response = await api.get(`/api/reports${params.toString() ? `?${params.toString()}` : ''}`);
      
      // Handle nested response structure
      if (response.data && response.data.data && response.data.data.reports) {
        return response.data.data.reports;
      } else if (response.data && response.data.reports) {
        return response.data.reports;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  },

  // Create a new report
  createReport: async (reportData) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for report creation");
      // Fallback to AsyncStorage for mock mode
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existingReports = await AsyncStorage.getItem('@medalert_reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      const newReport = {
        ...reportData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      reports.unshift(newReport);
      await AsyncStorage.setItem('@medalert_reports', JSON.stringify(reports));
      return newReport;
    }
    
    try {
      const response = await api.post("/api/reports", reportData);
      
      // Handle nested response structure for created report
      if (response.data && response.data.data && response.data.data.report) {
        return response.data.data.report;
      } else if (response.data && response.data.report) {
        return response.data.report;
      } else if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a report
  updateReport: async (reportId, updates) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for report update");
      // Fallback to AsyncStorage for mock mode
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existingReports = await AsyncStorage.getItem('@medalert_reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      const reportIndex = reports.findIndex(r => r.id === reportId);
      if (reportIndex !== -1) {
        reports[reportIndex] = { ...reports[reportIndex], ...updates, updatedAt: new Date().toISOString() };
        await AsyncStorage.setItem('@medalert_reports', JSON.stringify(reports));
        return reports[reportIndex];
      }
      throw new Error('Report not found');
    }
    
    try {
      const response = await api.put(`/api/reports/${reportId}`, updates);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Soft delete a report (mark as deleted)
  deleteReport: async (reportId, permanent = false) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for report deletion");
      // Fallback to AsyncStorage for mock mode
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existingReports = await AsyncStorage.getItem('@medalert_reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      
      if (permanent) {
        // Permanently delete
        const updatedReports = reports.filter(r => r.id !== reportId);
        await AsyncStorage.setItem('@medalert_reports', JSON.stringify(updatedReports));
      } else {
        // Soft delete - mark as deleted
        const reportIndex = reports.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
          reports[reportIndex] = {
            ...reports[reportIndex],
            status: 'deleted',
            deletedAt: new Date().toISOString()
          };
          await AsyncStorage.setItem('@medalert_reports', JSON.stringify(reports));
        }
      }
      
      return { success: true };
    }
    
    try {
      const response = await api.delete(`/api/reports/${reportId}${permanent ? '?permanent=true' : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get reports by status
  getReportsByStatus: async (userId, status) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for reports by status");
      const reports = await this.getReports(userId, true); // Include deleted for status filtering
      return reports.filter(report => report.status === status);
    }
    
    try {
      const response = await api.get(`/api/reports/status/${status}${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get deleted reports specifically
  getDeletedReports: async (userId) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for deleted reports");
      return await reportsAPI.getReportsByStatus(userId, 'deleted');
    }
    
    try {
      // Try the dedicated deleted reports endpoint first
      const response = await api.get(`/api/reports/deleted${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback to filtering by status if endpoint doesn't exist
        console.log("🔄 Deleted reports endpoint not found, falling back to status filter");
        try {
          return await reportsAPI.getReportsByStatus(userId, 'deleted');
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          return [];
        }
      }
      throw error;
    }
  },

  // Restore a deleted report
  restoreReport: async (reportId) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for report restoration");
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existingReports = await AsyncStorage.getItem('@medalert_reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      const reportIndex = reports.findIndex(r => r.id === reportId);
      
      if (reportIndex !== -1) {
        reports[reportIndex] = {
          ...reports[reportIndex],
          status: 'pending',
          deletedAt: null,
          restoredAt: new Date().toISOString()
        };
        await AsyncStorage.setItem('@medalert_reports', JSON.stringify(reports));
        return reports[reportIndex];
      }
      throw new Error('Report not found');
    }
    
    try {
      const response = await api.put(`/api/reports/${reportId}/restore`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback to updating status if restore endpoint doesn't exist
        console.log("🔄 Restore endpoint not found, falling back to status update");
        return await reportsAPI.updateReport(reportId, { 
          status: 'pending', 
          deletedAt: null, 
          restoredAt: new Date().toISOString() 
        });
      }
      throw error;
    }
  },

  // Permanently delete all deleted reports
  emptyTrash: async (userId) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for emptying trash");
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const existingReports = await AsyncStorage.getItem('@medalert_reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      
      // Remove all deleted reports
      const activeReports = reports.filter(r => r.status !== 'deleted' || r.userId !== userId);
      await AsyncStorage.setItem('@medalert_reports', JSON.stringify(activeReports));
      return { success: true };
    }
    
    try {
      const response = await api.delete(`/api/reports/trash${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback: Get all deleted reports and permanently delete them one by one
        console.log("🔄 Trash endpoint not found, falling back to individual deletions");
        try {
          const deletedReports = await reportsAPI.getDeletedReports(userId);
          const deletePromises = deletedReports.map(report => 
            reportsAPI.deleteReport(report.id, true) // true = permanent delete
          );
          await Promise.all(deletePromises);
          return { success: true };
        } catch (fallbackError) {
          console.error('Fallback trash emptying failed:', fallbackError);
          throw fallbackError;
        }
      }
      throw error;
    }
  }
};

// Settings API methods
export const settingsAPI = {
  // Get user settings
  getSettings: async (userId) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for settings");
      // Fallback to AsyncStorage for mock mode
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const settings = await AsyncStorage.getItem(`@medalert_settings_${userId}`);
      return settings ? JSON.parse(settings) : {};
    }
    
    try {
      const response = await api.get(`/api/settings${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user settings
  updateSettings: async (userId, settingsData) => {
    if (shouldUseMockAPI()) {
      console.log("🧪 Using Mock API for settings update");
      // Fallback to AsyncStorage for mock mode
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(`@medalert_settings_${userId}`, JSON.stringify(settingsData));
      return settingsData;
    }
    
    try {
      const response = await api.put("/api/settings", { userId, ...settingsData });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
